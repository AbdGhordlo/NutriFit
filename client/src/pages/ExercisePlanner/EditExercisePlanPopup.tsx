import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { X, RefreshCw, Heart, Plus } from "lucide-react";
import "../styles/EditPopupStyles.css";
import { DayPlan, Exercise } from "../../types/exercisePlannerTypes";

interface EditExercisePopupProps {
  weeklyPlan: DayPlan[];
  currentDay: number;
  onRegenerateDay: (dayNumber: number) => Promise<void>;
  onRegenerateExercise: (exerciseId: number) => Promise<void>;
  onAddToFavorites: (exercise: Exercise) => void;
  onReplaceWithFavorite: (exerciseId: number, favoriteExercise: Exercise) => void;
  onClose: () => void;
  favoriteExercises: Exercise[];
}

export const EditExercisePopup: React.FC<EditExercisePopupProps> = ({
  weeklyPlan,
  currentDay,
  onRegenerateDay,
  onRegenerateExercise,
  onAddToFavorites,
  onReplaceWithFavorite,
  onClose,
  favoriteExercises,
}) => {
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);
  const [regeneratingExerciseId, setRegeneratingExerciseId] = useState<number | null>(null);
  const [selectedExerciseForReplacement, setSelectedExerciseForReplacement] = useState<Exercise | null>(null);

  const handleRegenerateDay = async () => {
    setIsRegeneratingDay(true);
    try {
      await onRegenerateDay(weeklyPlan[currentDay].day_number);
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  const handleRegenerateExercise = async (exerciseId: number) => {
    setRegeneratingExerciseId(exerciseId);
    try {
      await onRegenerateExercise(exerciseId);
    } finally {
      setRegeneratingExerciseId(null);
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

        <div className="edit-plan-list">
          {weeklyPlan[currentDay].exercises.map((exercise) => (
            <div key={exercise.exercise_plan_exercise_id} className="edit-plan-item">
              <div className="edit-plan-info">
                <h3>{exercise.name}</h3>
                <p>{exercise.time} • {exercise.calories_burned} calories</p>
                <div className="exercise-details">
                  {exercise.has_reps_sets && (
                    <span>{exercise.sets}x{exercise.reps}</span>
                  )}
                  {exercise.has_duration && (
                    <span>{exercise.duration}</span>
                  )}
                </div>
              </div>

              <div className="edit-plan-actions">
                <button
                  onClick={() => handleRegenerateExercise(exercise.exercise_plan_exercise_id)}
                  disabled={regeneratingExerciseId === exercise.exercise_plan_exercise_id}
                  className="action-button small"
                >
                  {regeneratingExerciseId === exercise.id ? (
                    <ClipLoader color="#ffffff" size={15} />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                </button>

                <button
                  onClick={() => onAddToFavorites(exercise)}
                  className="action-button small"
                >
                  <Heart size={16} />
                </button>

                <button
                  onClick={() => setSelectedExerciseForReplacement(exercise)}
                  className={`action-button small ${selectedExerciseForReplacement?.id === exercise.id ? 'active' : ''}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedExerciseForReplacement && (
          <div className="favorites-section">
            <h3>Replace with a favorite exercise:</h3>
            <div className="favorites-list">
              {favoriteExercises.length > 0 ? (
                favoriteExercises.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="favorite-edit-plan-item"
                    onClick={() => {
                      onReplaceWithFavorite(selectedExerciseForReplacement.exercise_plan_exercise_id, favorite);
                      setSelectedExerciseForReplacement(null);
                    }}
                  >
                    <h4>{favorite.name}</h4>
                    <p>{favorite.calories_burned} calories</p>
                    {favorite.has_reps_sets && <p>{favorite.sets}x{favorite.reps}</p>}
                    {favorite.has_duration && <p>{favorite.duration}</p>}
                  </div>
                ))
              ) : (
                <p>No favorite exercises saved yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};