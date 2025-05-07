import React, { useState } from "react";
import { DayPlan, Meal } from "../../types/mealPlannerTypes";
import { ClipLoader } from "react-spinners";
import { X, RefreshCw, Heart, Plus } from "lucide-react";
import "../styles/EditPopupStyles.css";

interface EditPlanPopupProps {
  weeklyPlan: DayPlan[];
  currentDay: number;
  onRegenerateDay: (dayNumber: number) => Promise<void>;
  onRegenerateMeal: (mealId: number) => Promise<void>;
  onAddToFavorites: (meal: Meal) => void;
  onReplaceWithFavorite: (mealId: number, favoriteMeal: Meal) => void;
  onClose: () => void;
  favoriteMeals: Meal[];
}

export const EditPlanPopup: React.FC<EditPlanPopupProps> = ({
  weeklyPlan,
  currentDay,
  onRegenerateDay,
  onRegenerateMeal,
  onAddToFavorites,
  onReplaceWithFavorite,
  onClose,
  favoriteMeals,
}) => {
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);
  const [regeneratingMealId, setRegeneratingMealId] = useState<number | null>(null);
  const [selectedMealForReplacement, setSelectedMealForReplacement] = useState<number | null>(null);

  const handleRegenerateDay = async () => {
    setIsRegeneratingDay(true);
    try {
      await onRegenerateDay(weeklyPlan[currentDay].day_number);
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  const handleRegenerateMeal = async (mealId: number) => {
    setRegeneratingMealId(mealId);
    try {
      await onRegenerateMeal(mealId);
    } finally {
      setRegeneratingMealId(null);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="edit-plan-popup">
        <div className="popup-header">
          <h2>Edit Day {weeklyPlan[currentDay].day_number}</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="day-actions">
          <button
            onClick={handleRegenerateDay}
            disabled={isRegeneratingDay}
            className="action-button"
          >
            {isRegeneratingDay ? (
              <ClipLoader color="#ffffff" size={20} />
            ) : (
              <>
                <RefreshCw size={18} />
                <span>Regenerate Entire Day</span>
              </>
            )}
          </button>
        </div>

        <div className="meals-list">
          {weeklyPlan[currentDay].meals.map((meal) => (
            <div key={meal.id} className="meal-item">
              <div className="meal-info">
                <h3>{meal.name}</h3>
                <p>{meal.time} • {meal.calories} kcal</p>
                <div className="meal-macros">
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fats}g</span>
                </div>
              </div>

              <div className="meal-actions">
                <button
                  onClick={() => handleRegenerateMeal(meal.mealPlanMealId)}
                  disabled={regeneratingMealId === meal.id}
                  className="action-button small"
                >
                  {regeneratingMealId === meal.id ? (
                    <ClipLoader color="#ffffff" size={15} />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                </button>

                <button
                  onClick={() => onAddToFavorites(meal)}
                  className="action-button small"
                >
                  <Heart size={16} />
                </button>

                <button
                  onClick={() => setSelectedMealForReplacement(meal.id)}
                  className={`action-button small ${selectedMealForReplacement === meal.id ? 'active' : ''}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedMealForReplacement && (
          <div className="favorites-section">
            <h3>Replace with a favorite meal:</h3>
            <div className="favorites-list">
              {favoriteMeals.length > 0 ? (
                favoriteMeals.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="favorite-meal-item"
                    onClick={() => {
                      onReplaceWithFavorite(selectedMealForReplacement, favorite);
                      setSelectedMealForReplacement(null);
                    }}
                  >
                    <h4>{favorite.name}</h4>
                    <p>{favorite.calories} kcal</p>
                  </div>
                ))
              ) : (
                <p>No favorite meals saved yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};