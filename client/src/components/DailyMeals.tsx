import React from "react";
import { Clock, UtensilsCrossed, Loader } from "lucide-react";
import { styles } from "./styles/DailyMealsStyles";

interface Meal {
  id: number;
  mealId: number;
  name: string;
  time: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  description?: string;
  completed: boolean;
}

interface DailyMealsProps {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  currentDay: number;
  onToggle: (meal: Meal) => void;
}

const DailyMeals: React.FC<DailyMealsProps> = ({
  meals,
  loading,
  error,
  currentDay,
  onToggle,
}) => {
  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Today's Meal Plan</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <Loader size={24} className="animate-spin" />
          <span style={{ marginLeft: "0.5rem" }}>Loading meals...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Today's Meal Plan</h2>
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Today's Meal Plan</h2>

      <div style={styles.mealsList}>
        {meals.map((meal) => (
          <div key={meal.id} style={styles.mealItem(meal.completed)}>
            <div style={styles.mealInfo}>
              <div style={styles.iconContainer(meal.completed)}>
                <UtensilsCrossed size={20} />
              </div>

              <div style={styles.mealDetails}>
                <h3 style={styles.mealName}>{meal.name}</h3>
                <div style={styles.mealTime}>
                  <Clock size={16} />
                  <span>{meal.time}</span>
                  <span>•</span>
                  <span>{meal.calories} kcal</span>
                </div>
              </div>
            </div>

            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={meal.completed}
                onChange={() => onToggle(meal)}
                style={styles.checkboxInput}
              />
              <div
                style={{
                  ...styles.customCheckbox,
                  ...(meal.completed && styles.customCheckboxChecked),
                }}
              >
                <svg
                  style={{
                    ...styles.checkmark,
                    ...(meal.completed && styles.checkmarkChecked),
                  }}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10L9 12L13 8"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {meals.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
          }}
        >
          No meals planned for today. Consider adding some meals to your plan!
        </div>
      )}
    </div>
  );
};

export default DailyMeals;
