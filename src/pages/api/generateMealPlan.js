import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

const mealTypes = ["breakfast", "lunch", "dinner", "dessert"];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const getSmartMeal = (mealsList, minCalories, maxCalories, minProtein) => {
  const filtered = mealsList.filter(meal => {
    const calories = meal.calories || 0;
    const protein = meal.totalNutrients?.PROCNT?.quantity || 0;
    return calories >= minCalories && calories <= maxCalories && protein >= minProtein;
  });
  if (filtered.length > 0) {
    return filtered[Math.floor(Math.random() * filtered.length)];
  }
  return mealsList[Math.floor(Math.random() * mealsList.length)];
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const weight = parseFloat(user.weight || 70);
    const height = parseFloat(user.height || 170);
    const age = parseFloat(user.age || 25);
    const sex = user.sex === "Male" ? 5 : -161;

    const BMR = 10 * weight + 6.25 * height - 5 * age + sex;
    const activityMultiplier = user.activityLevel === "Very Active" ? 1.6 : user.activityLevel === "Active" ? 1.4 : 1.2;
    let dailyCaloriesBase = Math.round(BMR * activityMultiplier);

    if (user.fitnessGoal === "Muscle Gain") dailyCaloriesBase += 300;
    if (user.fitnessGoal === "Fat Loss") dailyCaloriesBase -= 300;

    const proteinMultiplier = user.fitnessGoal === "Endurance" ? 1.5 : 2;
    const targetProtein = Math.round(weight * proteinMultiplier);

    const dietFilter = user.fitnessGoal === "Fat Loss" ? "low-fat" : "high-protein";

    const fetchedMeals = {};

    // Fetch meals for each type
    for (const type of mealTypes) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getMeals?mealType=${encodeURIComponent(type)}&diet=${dietFilter}`);
      const data = await response.json();
      fetchedMeals[type] = data.meals || [];
    }

    const mealPlan = {};

    weekdays.forEach(day => {
      mealPlan[day] = {
        breakfast: getSmartMeal(fetchedMeals["breakfast"], 400, 600, 20),
        lunch: getSmartMeal(fetchedMeals["lunch"], 600, 800, 30),
        dinner: getSmartMeal(fetchedMeals["dinner"], 700, 900, 40),
        dessert: getSmartMeal(fetchedMeals["dessert"], 150, 300, 10),
        dailyCalories: dailyCaloriesBase,
        targetProtein: targetProtein,
      };
    });

    user.mealPlan = mealPlan;
    await user.save();

    res.status(200).json({ message: 'Meal plan generated successfully', mealPlan });

  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
