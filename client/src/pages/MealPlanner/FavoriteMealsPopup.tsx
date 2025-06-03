import { useState } from "react";
import { Meal } from "../../types/mealPlannerTypes";
import { ClipLoader } from "react-spinners";

interface FavoriteMealsPopupProps {
  favoriteMeals: Meal[];
  onRemoveFavorite: (mealId: number) => Promise<void>;
  closePopup: () => void;
}

export default function FavoriteMealsPopup({
  favoriteMeals,
  onRemoveFavorite,
  closePopup,
}: FavoriteMealsPopupProps) {
  const [mealToRemove, setMealToRemove] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveClick = (mealId: number) => {
    setMealToRemove(mealId);
  };

  const confirmRemove = async () => {
    if (mealToRemove === null) return;
    
    setIsRemoving(true);
    try {
      await onRemoveFavorite(mealToRemove);
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setIsRemoving(false);
      setMealToRemove(null);
    }
  };

  const cancelRemove = () => {
    setMealToRemove(null);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Favorite Meals</h2>
        
        {mealToRemove !== null && (
          <div className="confirmation-popup">
            <p>Are you sure you want to remove this meal from favorites?</p>
            <div className="confirmation-buttons">
              <button 
                className="confirm-button" 
                onClick={confirmRemove}
                disabled={isRemoving}
              >
                {isRemoving ? <ClipLoader size={20} color="#fff" /> : "Yes"}
              </button>
              <button 
                className="cancel-button" 
                onClick={cancelRemove}
                disabled={isRemoving}
              >
                No
              </button>
            </div>
          </div>
        )}

        <div className="items-list">
          {favoriteMeals.length === 0 ? (
            <p className="no-favorites">No favorite meals yet</p>
          ) : (
            favoriteMeals.map((meal) => (
              <div key={meal.id} className="favorite-list-item">
                <div className="item-info">
                  <h3 className="item-name">{meal.name}</h3>
                  <p className="item-description">{meal.description}</p>
                  <div className="macros-container">
                    <div className="macro-item">
                      <span className="macro-value">{meal.calories}</span>
                      <span className="macro-label">Calories</span>
                    </div>
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
                <button
                  className="remove-button"
                  onClick={() => handleRemoveClick(meal.meal_id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <button className="close-button" onClick={closePopup}>
          Close
        </button>
      </div>
    </div>
  );
}