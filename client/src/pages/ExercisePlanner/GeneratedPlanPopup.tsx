import { ClipLoader } from "react-spinners";
import { GeneratedExercisePlan } from "../../types/exercisePlannerTypes";

export default function GeneratedPlanPopup({
  generatedPlan,
  isGenerating,
  handleSavePlan,
  handleSaveAndAdoptPlan,
  handleClosePopup,
  handleRegeneratePlan,
}: any) {
  const groupExercisesByDay = (
    exercises: GeneratedExercisePlan["exercises"]
  ) => {
    const groupedExercises: {
      [key: number]: GeneratedExercisePlan["exercises"];
    } = {};

    exercises.forEach((exercise) => {
      if (!groupedExercises[exercise.day_number]) {
        groupedExercises[exercise.day_number] = [];
      }
      groupedExercises[exercise.day_number].push(exercise);
    });

    return groupedExercises;
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {isGenerating ? (
          <div className="loading-container">
            <ClipLoader color="#7ec987" size={50} />
            <p>Generating your exercise plan...</p>
          </div>
        ) : (
          <>
            <h2>Generated Exercise Plan</h2>
            {generatedPlan && (
              <div className="generated-plan">
                <h3>{generatedPlan.exercise_plan.name}</h3>
                <p>{generatedPlan.exercise_plan.description}</p>
                {Object.entries(
                  groupExercisesByDay(generatedPlan.exercises)
                ).map(([day, exercises]) => (
                  <div key={day} className={`day-container`}>
                    <div className="day-header">
                      <h2 className="day-name">Day {day}</h2>
                    </div>
                    <div className="items-list">
                      {exercises.map((exercise, index) => (
                        <div key={index} className="list-item">
                          <div className="item-info">
                            <h3 className="item-name">{exercise.name}</h3>
                            <div className="item-time-info">
                              <span className="item-time">{exercise.time}</span>
                              <span className="dot">•</span>
                              <span className="item-time">
                                {exercise.calories_burned} kcal
                              </span>
                            </div>
                          </div>
                          <div className="details-container">
                            {exercise.has_reps_sets && (
                              <div className="detail-item">
                                <span className="detail-label">Reps:</span>
                                <span className="detail-value">
                                  {exercise.reps}
                                </span>
                              </div>
                            )}
                            {exercise.has_reps_sets && (
                              <div className="detail-item">
                                <span className="detail-label">Sets:</span>
                                <span className="detail-value">
                                  {exercise.sets}
                                </span>
                              </div>
                            )}
                            {exercise.has_duration && (
                              <div className="detail-item">
                                <span className="detail-label">Duration:</span>
                                <span className="detail-value">
                                  {exercise.duration}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="popup-buttons">
              <button
                className="regenerate-button"
                onClick={handleRegeneratePlan}
              >
                Regenerate
              </button>
              <button className="save-button" onClick={handleSavePlan}>
                Save Plan
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
  );
}
