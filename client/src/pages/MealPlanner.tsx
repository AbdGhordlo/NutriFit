import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wand2, Edit3, Bookmark } from "lucide-react";
import { ClipLoader } from "react-spinners";
import "./styles/MealPlannerStyles.css";
import "../assets/commonStyles.css";
import { generateMealPlan, saveMealPlan, saveAndAdoptMealPlan, adoptMealPlan, getAllMealPlansByUser } from "../api/MealPlannerAI";
import { getUserIdFromToken } from "../utils/auth";
import ErrorMessage from "../components/ErrorMessage";

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

interface GeneratedMealPlan {
  meal_plan: {
    name: string;
    description: string;
  };
  meals: {
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    time: string;
    day_number: number;
  }[];
}

export default function MealPlanner() {
  const [currentDay, setCurrentDay] = useState(0);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showSavedPlansPopup, setShowSavedPlansPopup] = useState(false); // New state for saved plans popup
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedMealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState('');
  const [savedPlans, setSavedPlans] = useState<any[]>([]); // State to store saved plans

  useEffect(() => {
    const id = getUserIdFromToken();
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return; // Prevent running when userId is not set

    const fetchMealPlan = async () => {
      const token = localStorage.getItem("token"); // Retrieve JWT from local storage

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login"; // Redirect if no token is found
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/meal-planner/${userId}/adopted`,
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
        // console.log(data); // Log the API response

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
  }, [userId]); // Runs only when userId is updated

  const handleFetchSavedPlans = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `http://localhost:5000/meal-planner/${userId}/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSavedPlans(data);
      setShowSavedPlansPopup(true);
    } catch (error) {
      console.error("Error fetching saved plans:", error);
    }
  };

  const handleAdoptPlan = async (mealPlanId: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const userId = Number(getUserIdFromToken()); // Ensure userId is a number
      if (isNaN(userId)) throw new Error("Invalid user ID");

      await adoptMealPlan(userId, mealPlanId, token);
      alert("Meal plan adopted successfully!");
      window.location.reload(); // Reload to reflect the new adopted plan
    } catch (error) {
      console.error("Error adopting meal plan:", error);
      alert("Failed to adopt meal plan.");
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setShowPopup(true);

    try {
      const plan = await generateMealPlan(); // Call the AI function
      setGeneratedPlan(plan);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setGeneratedPlan(null);
  };

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
    return <div className="no-plan-error-container"><ErrorMessage message={"No meal plan data found."} /></div>;
  }

  // Group meals by day
  const groupMealsByDay = (meals: GeneratedMealPlan["meals"]) => {
    const groupedMeals: { [key: number]: GeneratedMealPlan["meals"] } = {};

    meals.forEach((meal) => {
      if (!groupedMeals[meal.day_number]) {
        groupedMeals[meal.day_number] = [];
      }
      groupedMeals[meal.day_number].push(meal);
    });

    return groupedMeals;
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const userId = Number(getUserIdFromToken()); // Ensure userId is a number
      if (isNaN(userId)) throw new Error("Invalid user ID");

      await saveMealPlan(userId, generatedPlan, token);
      alert("Meal plan saved successfully!");
    } catch (error) {
      console.error("Error saving meal plan:", error);
      alert("Failed to save meal plan.");
    }
  };

  const handleSaveAndAdoptPlan = async () => {
    if (!generatedPlan) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const userId = Number(getUserIdFromToken()); // Ensure userId is a number
      if (isNaN(userId)) throw new Error("Invalid user ID");

      await saveAndAdoptMealPlan(userId, generatedPlan, token);
      alert("Meal plan adopted successfully!");
      window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error("Error adopting meal plan:", error);
      alert("Failed to adopt meal plan.");
    }
  };

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
          <button className="generate-button" onClick={handleGeneratePlan}>
            <Wand2 className="button-icon" />
            <span>Generate Plan</span>
          </button>

          <button className="edit-button">
            <Edit3 className="button-icon" />
            <span>Edit Plan</span>
          </button>

          <button className="saved-plans-button" onClick={handleFetchSavedPlans}>
            <Bookmark className="button-icon" />
            <span>Saved Plans</span>
          </button>
        </div>

        {showSavedPlansPopup && (
          <div className="popup-overlay">
            <div className="popup-container">
              <h2>Saved Plans</h2>
              <div className="saved-plans-list">
                {savedPlans.map((plan) => (
                  <div key={plan.meal_plan_id} className="saved-plan-item">
                    <div className="plan-info">
                      <h3>{plan.meal_plan_name}</h3>
                      <p>{plan.meal_plan_description}</p>
                    </div>
                    {plan.is_adopted_plan ? (
                      <button
                        className="adopt-button adopted"
                        disabled
                      >
                        Adopted
                      </button>
                    ) : (
                      <button
                        className="adopt-button"
                        onClick={() => handleAdoptPlan(plan.meal_plan_id)}
                      >
                        Adopt
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button className="close-button" onClick={() => setShowSavedPlansPopup(false)}>
                Close
              </button>
            </div>
          </div>
        )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            {isGenerating ? (
              <div className="loading-container">
                <ClipLoader color="#7ec987" size={50} />
                <p>Generating your meal plan...</p>
              </div>
            ) : (
              <>
                <h2>Generated Meal Plan</h2>
                {generatedPlan && (
                  <div className="generated-plan">
                    <h3>{generatedPlan.meal_plan.name}</h3>
                    <p>{generatedPlan.meal_plan.description}</p>
                    {Object.entries(groupMealsByDay(generatedPlan.meals)).map(
                      ([day, meals]) => (
                        <div
                          key={day}
                          className={`day-container`}
                        >
                          <div className="day-header">
                            <h2 className="day-name">Day {day}</h2>
                          </div>
                          <div className="items-list">
                            {meals.map((meal, index) => (
                              <div key={index} className="list-item">
                                <div className="item-info">
                                  <h3 className="item-name">{meal.name}</h3>
                                  <div className="item-time-info">
                                    <span className="item-time">
                                      {meal.time}
                                    </span>
                                    <span className="dot">•</span>
                                    <span className="item-time">
                                      {meal.calories} kcal
                                    </span>
                                  </div>
                                </div>
                                <div className="macros-container">
                                  <div className="macro-item">
                                    <span className="macro-value">
                                      {meal.protein}g
                                    </span>
                                    <span className="macro-label">Protein</span>
                                  </div>
                                  <div className="macro-item">
                                    <span className="macro-value">
                                      {meal.carbs}g
                                    </span>
                                    <span className="macro-label">Carbs</span>
                                  </div>
                                  <div className="macro-item">
                                    <span className="macro-value">
                                      {meal.fats}g
                                    </span>
                                    <span className="macro-label">Fats</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
                <div className="popup-buttons">
                  <button className="save-button" onClick={handleSavePlan}>
                    Add to Saved Plans
                  </button>
                  <button className="adopt-button" onClick={handleSaveAndAdoptPlan}>
                    Save & Adopt
                  </button>
                  <button className="close-button" onClick={handleClosePopup}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
