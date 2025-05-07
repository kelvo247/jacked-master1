import { useEffect, useState } from "react";

const mealTypes = ["breakfast", "lunch", "dinner", "dessert"];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const MealPlanner = () => {
  const [meals, setMeals] = useState({});
  const [allMeals, setAllMeals] = useState({});

  // Fetch meals from API
  const fetchMeals = async () => {
    try {
      const fetchedMeals = {};
      const categorizedMeals = {};

      for (const type of mealTypes) {
        const response = await fetch(`/api/getMeals?mealType=${encodeURIComponent(type)}`);
        const data = await response.json();

        if (!data || !data.meals) {
          console.error(`No meals received for ${type}`);
          continue;
        }

        fetchedMeals[type] = data.meals;
      }

      weekdays.forEach(day => {
        categorizedMeals[day] = {
          breakfast: getRandomMeal(fetchedMeals["breakfast"]),
          lunch: getRandomMeal(fetchedMeals["lunch"]),
          dinner: getRandomMeal(fetchedMeals["dinner"]),
          dessert: getRandomMeal(fetchedMeals["dessert"]),
        };
      });

      setAllMeals(fetchedMeals);
      setMeals(categorizedMeals);
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const getRandomMeal = (mealsList) => {
    return mealsList?.length ? mealsList[Math.floor(Math.random() * mealsList.length)] : null;
  };

  // Randomize meals for a specific day
  const randomizeMeals = (day) => {
    setMeals((prev) => ({
      ...prev,
      [day]: {
        breakfast: getRandomMeal(allMeals["breakfast"]),
        lunch: getRandomMeal(allMeals["lunch"]),
        dinner: getRandomMeal(allMeals["dinner"]),
        dessert: getRandomMeal(allMeals["dessert"]),
      }
    }));
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="meal-planner-container">
      <h1 className="title">Weekly Meal Plan</h1>

      <div className="meal-columns">
        {weekdays.map(day => (
          <div key={day} className="day-container">
            <div className="day-header">{day}</div>
            {mealTypes.map(type => {
              const meal = meals[day]?.[type];
              return (
                <div key={type} className="meal-card">
                  <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                  {meal ? (
                    <div className="meal-info">
                      <img src={meal.image} alt={meal.label} className="meal-image" />
                      <p className="meal-name">{meal.label}</p>
                      <div className="nutrition">
                        <p><strong>Calories:</strong> {meal.calories?.toFixed(0) || "N/A"} kcal</p>
                        <p><strong>Protein:</strong> {meal.totalNutrients?.PROCNT?.quantity?.toFixed(1) || "N/A"} g</p>
                        <p><strong>Carbs:</strong> {meal.totalNutrients?.CHOCDF?.quantity?.toFixed(1) || "N/A"} g</p>
                        <p><strong>Fat:</strong> {meal.totalNutrients?.FAT?.quantity?.toFixed(1) || "N/A"} g</p>
                      </div>
                    </div>
                  ) : (
                    <p>No meal selected</p>
                  )}
                </div>
              );
            })}
            <button className="randomize-btn" onClick={() => randomizeMeals(day)}>Randomize</button>
          </div>
        ))}
      </div>

      <style jsx>{`
  .meal-columns {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding: 10px;
  }

  .day-container {
    flex: 0 0 auto;
    width: 200px;
    margin-right: 15px;
    background: white;
    border-radius: 10px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    overflow-y: auto;
  }

  .day-header {
    background-color:rgb(0, 0, 0);
    color: white;
    font-weight: bold;
    padding: 10px;
    border-radius: 6px 6px 0 0;
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .meal-card {
    text-align: center;
    padding: 10px;
  }

  .meal-image {
    width: 100%;
    height: auto;
    border-radius: 6px;
    margin-bottom: 5px;
  }

  .nutrition {
    font-size: 12px;
    text-align: left;
    margin-top: 5px;
  }

  .randomize-btn {
    background-color:rgb(0, 0, 0);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 6px;
    margin: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s ease;
  }

  .randomize-btn:hover {
    background-color:rgb(0, 0, 0);
  }
`}</style>

    </div>
  );
};

export default MealPlanner;
