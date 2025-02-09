import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wand2, Edit3 } from "lucide-react";
import { styles } from "./styles/MealPlannerStyles";
import { commonStyles } from "./styles/commonStyles";

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
  const [navHover, setNavHover] = useState<string | null>(null);
  const [genHover, setGenHover] = useState(false);
  const [editHover, setEditHover] = useState(false);
  const [itemHover, setItemHover] = useState<number | null>(null);

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
        const response = await fetch(`http://localhost:5000/meal-planner/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
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
            id: meal.meal_id,
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

  if (weeklyPlan.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.mainContainer}>
        <h1 style={commonStyles.title}>Weekly Plan</h1>

        <div style={commonStyles.dayContainer(isToday(currentDay))}>
          <div style={commonStyles.dayHeader}>
            <h2 style={commonStyles.dayName}>Day {weeklyPlan[currentDay].day_number}</h2>
          </div>

          <div style={commonStyles.itemsList}>
            {weeklyPlan[currentDay].meals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  ...commonStyles.listItem,
                  border: itemHover === meal.id ? "1px solid rgba(126, 201, 135)" : "1px solid #f3f4f6",
                }}
                onMouseEnter={() => setItemHover(meal.id)}
                onMouseLeave={() => setItemHover(null)}
              >
                <div style={commonStyles.itemInfo}>
                  <h3 style={commonStyles.itemName}>{meal.name}</h3>
                  <div style={commonStyles.itemTimeInfo}>
                    <span style={commonStyles.itemTime}>{meal.time}</span>
                    <span style={commonStyles.dot}>•</span>
                    <span style={commonStyles.itemTime}>{meal.calories} kcal</span>
                  </div>
                </div>

                <div style={styles.macrosContainer}>
                  <div style={styles.macroItem}>
                    <span style={styles.macroValue}>{meal.protein}g</span>
                    <span style={styles.macroLabel}>Protein</span>
                  </div>
                  <div style={styles.macroItem}>
                    <span style={styles.macroValue}>{meal.carbs}g</span>
                    <span style={styles.macroLabel}>Carbs</span>
                  </div>
                  <div style={styles.macroItem}>
                    <span style={styles.macroValue}>{meal.fats}g</span>
                    <span style={styles.macroLabel}>Fats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={commonStyles.navigationContainer}>
          <button
            onClick={handlePrevDay}
            disabled={currentDay === 0}
            style={{
              ...commonStyles.navButton(currentDay === 0),
              backgroundColor: navHover === "prev" ? "rgba(126, 201, 135, 0.1)" : "transparent",
            }}
            onMouseEnter={() => setNavHover("prev")}
            onMouseLeave={() => setNavHover(null)}
          >
            <ChevronLeft
              style={{
                width: 24,
                height: 24,
                color: currentDay === 0 ? "#d1d5db" : "#7ec987",
              }}
            />
          </button>

          <button
            onClick={handleNextDay}
            disabled={currentDay === 6}
            style={{
              ...commonStyles.navButton(currentDay === 6),
              backgroundColor: navHover === "next" ? "rgba(126, 201, 135, 0.1)" : "transparent",
            }}
            onMouseEnter={() => setNavHover("next")}
            onMouseLeave={() => setNavHover(null)}
          >
            <ChevronRight
              style={{
                width: 24,
                height: 24,
                color: currentDay === 6 ? "#d1d5db" : "#7ec987",
              }}
            />
          </button>
        </div>
      </div>

      <div style={commonStyles.buttonsContainer}>
        <button
          style={{
            ...commonStyles.generateButton,
            backgroundColor: genHover ? "#6db776" : "#7ec987",
          }}
          onMouseEnter={() => setGenHover(true)}
          onMouseLeave={() => setGenHover(false)}
        >
          <Wand2 style={{ width: 20, height: 20 }} />
          <span>Generate Plan</span>
        </button>

        <button
          style={{
            ...commonStyles.editButton,
            backgroundColor: editHover ? "rgba(126, 201, 135, 0.1)" : "transparent",
          }}
          onMouseEnter={() => setEditHover(true)}
          onMouseLeave={() => setEditHover(false)}
        >
          <Edit3 style={{ width: 20, height: 20 }} />
          <span>Edit Plan</span>
        </button>
      </div>
    </div>
  );
}