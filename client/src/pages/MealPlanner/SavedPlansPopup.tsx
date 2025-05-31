import React from "react";

export default function SavedPlansPopup({
  savedPlans,
  handleAdoptPlan,
  closePopup,
  handleRemovePlan
}: any) {
  return (
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
                <button className="adopt-button adopted" disabled>
                  Adopted
                </button>
              ) : (
                <>
                <button
                  className="adopt-button"
                  onClick={() => handleAdoptPlan(plan.meal_plan_id)}
                >
                  Adopt
                </button>
                <button
                  className="remove-button"
                  onClick={() => handleRemovePlan(plan.meal_plan_id)}
                >Remove</button>
                </>
              )}
            </div>
          ))}
        </div>
        <button className="close-button" onClick={closePopup}>
          Close
        </button>
      </div>
    </div>
  );
}
