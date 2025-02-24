import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wand2, Edit3 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import "./styles/MealPlannerStyles.css";
import "../assets/commonStyles.css";

interface Meal {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}

interface DayPlan {
  day_number: number;
  meals: Meal[];
}

export default function MealPlanner() {
  const [currentDay, setCurrentDay] = useState(0); // Start with Day 1
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealPlan = async () => {
      const userId = 1; // Replace with the logged-in user's ID
      const token = localStorage.getItem("token"); // Retrieve JWT from local storage

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login"; // Redirect if no token is found
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/meal-planner/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          console.error("Unauthorized, removing token and redirecting...");
          localStorage.removeItem("token"); // Remove expired/invalid token
          window.location.href = "/login"; // Redirect to login page
          return;
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Log the API response

        // Group meals by day
        const groupedData = data.reduce((acc: any, meal: any) => {
          const day = meal.day_number - 1; // Convert to 0-based index
          if (!acc[day]) {
            acc[day] = { day_number: meal.day_number, meals: [] };
          }
          acc[day].meals.push({
            id: meal.meal_plan_meal_id, // Use meal_plan_meal.id as the unique key
            meal_id: meal.meal_id, // Keep meal_id for reference
            name: meal.meal_name,
            description: meal.meal_description,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats,
            time: meal.time,
          });
          return acc;
        }, []);

        setWeeklyPlan(groupedData);
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchMealPlan();
  }, []);

  const handlePrevDay = () => {
    if (currentDay > 0) {
      setCurrentDay(currentDay - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDay < 6) {
      setCurrentDay(currentDay + 1);
    }
  };

  const isToday = (day: number) => {
    const date = new Date();
    return day === date.getDay() ? true : false;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#7ec987" size={50} /> {/* Display the spinner */}
      </div>
    );
  }

  if (weeklyPlan.length === 0) {
    return <div>No meal plan data found.</div>;
  }

  return (
    <div className="outer-container">
      <div className="main-container">
        <h1 className="title">Weekly Plan</h1>

        <div className={`day-container ${isToday(currentDay) ? "today" : ""}`}>
          <div className="day-header">
            <h2 className="day-name">
              Day {weeklyPlan[currentDay].day_number}
            </h2>
          </div>

          <div className="items-list">
            {weeklyPlan[currentDay].meals.map((meal) => (
              <div key={meal.id} className="list-item">
                {/* Use meal_plan_meal.id as the key */}
                <div className="item-info">
                  <h3 className="item-name">{meal.name}</h3>
                  <div className="item-time-info">
                    <span className="item-time">{meal.time}</span>
                    <span className="dot">•</span>
                    <span className="item-time">{meal.calories} kcal</span>
                  </div>
                </div>
                <div className="macros-container">
                  <div className="macro-item">
                    <span className="macro-value">{meal.protein}g</span>
                    <span className="macro-label">Protein</span>
                  </div>
                  <div className="macro-item">
                    <span className="macro-value">{meal.carbs}g</span>
                    <span className="macro-label">Carbs</span>
                  </div>
                  <div className="macro-item">
                    <span className="macro-value">{meal.fats}g</span>
                    <span className="macro-label">Fats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="navigation-container">
          <button
            onClick={handlePrevDay}
            disabled={currentDay === 0}
            className={`nav-button ${currentDay === 0 ? "disabled" : ""}`}
          >
            <ChevronLeft className="nav-icon" />
          </button>

          <button
            onClick={handleNextDay}
            disabled={currentDay === 6}
            className={`nav-button ${currentDay === 6 ? "disabled" : ""}`}
          >
            <ChevronRight className="nav-icon" />
          </button>
        </div>
      </div>

      <div className="buttons-container">
        <button className="generate-button">
          <Wand2 className="button-icon" />
          <span>Generate Plan</span>
        </button>

        <button className="edit-button">
          <Edit3 className="button-icon" />
          <span>Edit Plan</span>
        </button>
      </div>
    </div>
  );
}
