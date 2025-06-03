import { useState } from "react";
import { Exercise } from "../../types/exercisePlannerTypes";
import { ClipLoader } from "react-spinners";

interface FavoriteExercisesPopupProps {
  favoriteExercises: Exercise[];
  onRemoveFavorite: (exerciseId: number) => Promise<void>;
  closePopup: () => void;
}

export default function FavoriteExercisesPopup({
  favoriteExercises,
  onRemoveFavorite,
  closePopup,
}: FavoriteExercisesPopupProps) {
  const [exerciseToRemove, setExerciseToRemove] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveClick = (exerciseId: number) => {
    setExerciseToRemove(exerciseId);
  };

  const confirmRemove = async () => {
    if (exerciseToRemove === null) return;
    
    setIsRemoving(true);
    try {
      await onRemoveFavorite(exerciseToRemove);
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setIsRemoving(false);
      setExerciseToRemove(null);
    }
  };

  const cancelRemove = () => {
    setExerciseToRemove(null);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Favorite Exercises</h2>
        
        {exerciseToRemove !== null && (
          <div className="confirmation-popup">
            <p>Are you sure you want to remove this exercise from favorites?</p>
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
          {favoriteExercises.length === 0 ? (
            <p className="no-favorites">No favorite exercises yet</p>
          ) : (
            favoriteExercises.map((exercise) => (
              <div key={exercise.id} className="favorite-list-item">
                <div className="item-info">
                  <h3 className="item-name">{exercise.name}</h3>
                  <p className="item-description">{exercise.description}</p>
                  <div className="details-container">
                    {exercise.has_reps_sets && (
                      <>
                        <div className="detail-item">
                          <span className="detail-label">Reps:</span>
                          <span className="detail-value">{exercise.reps}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Sets:</span>
                          <span className="detail-value">{exercise.sets}</span>
                        </div>
                      </>
                    )}
                    {exercise.has_duration && (
                      <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{exercise.duration}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Calories:</span>
                      <span className="detail-value">{exercise.calories_burned}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveClick(exercise.exercise_id)}
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