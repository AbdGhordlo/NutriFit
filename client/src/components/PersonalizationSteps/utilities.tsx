// src/components/PersonalizationSteps/utilities.tsx
import * as React from "react";
import { FitnessGoal, WeightGoal, ActivityLevel, Budget } from "../../types/personalization";
import { Slider } from "../Slider";

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 helper: renders the two sliders (Target + Time Frame) for weight-based goals.
// We now branch on goalType to handle lose_weight vs. build_muscle rules.
// ─────────────────────────────────────────────────────────────────────────────
export const renderGoalWeightInputs = (
  personalWeight: number,               // user’s current weight from Step 1
  weightGoal: WeightGoal,
  setWeightGoal: (goal: WeightGoal) => void,
  goalType: FitnessGoal["type"]         // either "lose_weight" or "build_muscle"
) => {
  if (goalType === "lose_weight") {
    // -------------------- LOSE WEIGHT --------------------
    const diff = personalWeight - weightGoal.targetWeight;
    const minWeeks = diff > 0 ? Math.ceil(diff / 2) : 1;

    return (
      <div className="w-full space-y-4 mt-4">
        {/** Target Weight slider **/}
        <Slider
          label="Target Weight"
          value={weightGoal.targetWeight}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, targetWeight: value })
          }
          min={20}
          max={personalWeight}           // clamp at current weight
          unit="kg"
        />

        {/** Time Frame slider **/}
        <Slider
          label="Time Frame"
          value={weightGoal.timeframe}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, timeframe: value })
          }
          min={minWeeks}                // dynamic minimum (ceil(diff/2) or 1)
          max={52}
          unit=" weeks"
        />
      </div>
    );
  } else if (goalType === "build_muscle") {
    // -------------------- BUILD MUSCLE --------------------
    const diff = weightGoal.targetWeight - personalWeight;
    const minWeeks = diff > 0 ? Math.ceil(diff / 2) : 1;

    return (
      <div className="w-full space-y-4 mt-4">
        {/** Target Weight slider **/}
        <Slider
          label="Target Weight"
          value={weightGoal.targetWeight}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, targetWeight: value })
          }
          min={personalWeight}          // clamp to at least current weight
          max={personalWeight + 50}     // allow up to +50 kg above current
          unit="kg"
        />

        {/** Time Frame slider **/}
        <Slider
          label="Time Frame"
          value={weightGoal.timeframe}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, timeframe: value })
          }
          min={minWeeks}                 // dynamic min = ceil((target–current)/2) or 1
          max={52}
          unit=" weeks"
        />
      </div>
    );
  }

  // If neither “lose_weight” nor “build_muscle,” return null (no sliders)
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper function to render each fitness goal card. We added goalType so that
// renderGoalWeightInputs knows which branch to use.
// ─────────────────────────────────────────────────────────────────────────────
export const renderGoalCard = (
  personalWeight: number,
  type: FitnessGoal["type"],
  icon: React.ReactNode,
  title: string,
  description: string,
  fitnessGoal: FitnessGoal,
  setFitnessGoal: (goal: FitnessGoal) => void,
  weightGoal: WeightGoal,
  setWeightGoal: (goal: WeightGoal) => void
) => (
  <button
    onClick={() => {
      if (type === "lose_weight" || type === "build_muscle") {
        // Pass the existing weightGoal so we can edit it in Step 2.
        setFitnessGoal({ type, goal: weightGoal });
      } else {
        setFitnessGoal({ type });
      }
    }}
    className={`w-full p-6 rounded-lg border-[1.5px] transition-all ${
      fitnessGoal.type === type
        ? "border-primary-green"
        : "border-gray-200 hover:border-primary-green"
    }`}
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="text-dark-green">{icon}</div>
      <h3 className="text-lg font-semibold text-dark-green">{title}</h3>
    </div>
    <p className="text-sm text-secondary-text text-left">{description}</p>

    {/**
      Only show the weight sliders if this card is “lose_weight” or “build_muscle”
      and it is currently selected:
    **/}
    {(type === "lose_weight" || type === "build_muscle") &&
      fitnessGoal.type === type &&
      renderGoalWeightInputs(personalWeight, weightGoal, setWeightGoal, type)}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// (The rest of your helper functions remain unchanged.)
// ─────────────────────────────────────────────────────────────────────────────
export const renderPreferenceButton = (
  value: string,
  label: string,
  isSelected: boolean,
  onClick: () => void
) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-all ${
      isSelected
        ? "bg-primary-green text-white"
        : "bg-white border border-gray-200 hover:border-primary-green"
    }`}
  >
    {label}
  </button>
);

export const renderActivityCard = (
  level: ActivityLevel,
  title: string,
  description: string,
  activityLevel: ActivityLevel,
  setActivityLevel: (level: ActivityLevel) => void
) => (
  <button
    onClick={() => setActivityLevel(level)}
    className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
      activityLevel === level
        ? "border-primary-green bg-light-green"
        : "border-gray-200 hover:border-primary-green"
    }`}
  >
    <h3 className="text-lg font-semibold text-dark-green mb-2">{title}</h3>
    <p className="text-sm text-secondary-text">{description}</p>
  </button>
);

export const renderBudgetOption = (
  option: Budget,
  description: string,
  budget: Budget,
  setBudget: (option: Budget) => void
) => (
  <button
    onClick={() => setBudget(option)}
    className={`w-full p-6 rounded-lg border-2 transition-all ${
      budget === option
        ? "border-primary-green bg-light-green"
        : "border-gray-200 hover:border-primary-green"
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg font-semibold text-dark-green">
        {option.charAt(0).toUpperCase() + option.slice(1)}
      </span>
    </div>
    <p className="text-sm text-secondary-text text-left">{description}</p>
  </button>
);
