import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    email,
    weight,
    height,
    age,
    sex,
    fitnessGoal,
    experience,
    trainingStyle,
    trainingDays,
    equipment,
    weakPoints,
    activityLevel
  } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        weight,
        height,
        age,
        sex,
        fitnessGoal,
        experience,
        trainingStyle,
        trainingDays,
        equipment,
        weakPoints,
        activityLevel,
      },
      { new: true, upsert: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Save progress snapshot to MongoDB
    const progressEntry = {
      date: new Date().toISOString(),
      weight,
      height,
      activityLevel,
      fitnessGoal,
      experience,
      trainingDays,
    };

    user.progressHistory = [
      ...(user.progressHistory || []),
      progressEntry,
    ];

    // Nutrition and meal plan logic
    const weightNum = parseFloat(weight || 70);
    const heightNum = parseFloat(height || 170);
    const ageNum = parseFloat(age || 25);
    const sexAdj = sex === "Male" ? 5 : -161;

    const BMR = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + sexAdj;
    const multiplier =
      activityLevel === "Very Active" ? 1.6 :
      activityLevel === "Active" ? 1.4 :
      1.2;
    let dailyCaloriesBase = Math.round(BMR * multiplier);

    if (fitnessGoal === "Muscle Gain") dailyCaloriesBase += 300;
    if (fitnessGoal === "Fat Loss") dailyCaloriesBase -= 300;

    const proteinMultiplier = fitnessGoal === "Endurance" ? 1.5 : 2;
    const targetProtein = Math.round(weightNum * proteinMultiplier);

    const weekdays = [
      "Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday"
    ];
    const mealTypes = ["breakfast", "lunch", "dinner", "dessert"];
    const fetchedMeals = {};

    for (const type of mealTypes) {
      const response = await fetch(
        `http://localhost:3000/api/getMeals?mealType=${type}&diet=${
          fitnessGoal === "Fat Loss" ? "low-fat" : "high-protein"
        }`
      );
      const data = await response.json();
      fetchedMeals[type] = data.meals || [];
    }

    const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
    const getSmartMeal = (meals, minC, maxC, minP) => {
      const filtered = meals.filter((m) => {
        const cals = m.calories || 0;
        const protein = m.totalNutrients?.PROCNT?.quantity || 0;
        return cals >= minC && cals <= maxC && protein >= minP;
      });
      return filtered.length
        ? filtered[Math.floor(Math.random() * filtered.length)]
        : meals[Math.floor(Math.random() * meals.length)];
    };

    const mealPlan = {};
    const shuffledBreakfasts = shuffle([
      ...fetchedMeals["breakfast"],
      ...fetchedMeals["breakfast"],
    ]);
    const shuffledLunches = shuffle([
      ...fetchedMeals["lunch"],
      ...fetchedMeals["lunch"],
    ]);
    const dinners = fetchedMeals["dinner"];
    const desserts = fetchedMeals["dessert"];

    weekdays.forEach((day, i) => {
      mealPlan[day] = {
        breakfast: shuffledBreakfasts[i % shuffledBreakfasts.length],
        lunch: shuffledLunches[i % shuffledLunches.length],
        dinner: getSmartMeal(dinners, 700, 900, 40),
        dessert: getSmartMeal(desserts, 150, 300, 10),
        dailyCalories: dailyCaloriesBase,
        targetProtein,
      };
    });

    user.mealPlan = mealPlan;

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.error("🔥 Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

