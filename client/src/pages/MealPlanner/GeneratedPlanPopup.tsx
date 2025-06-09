import { GeneratedMealPlan } from "../../types/mealPlannerTypes";
import { ClipLoader } from "react-spinners";

export default function GeneratedPlanPopup({
  generatedPlan,
  isGenerating,
  handleSavePlan,
  handleSaveAndAdoptPlan,
  handleClosePopup,
  handleRegeneratePlan,
}: any) {
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

  return (
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
                    <div key={day} className={`day-container`}>
                      <div className="day-header">
                        <h2 className="day-name">Day {day}</h2>
                      </div>
                      <div className="items-list">
                        {meals.map((meal, index) => (
                          <div key={index} className="list-item">
                            <div className="item-info">
                              <h3 className="item-name">{meal.name}</h3>
                              <div className="item-time-info">
                                <span className="item-time">{meal.time}</span>
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
