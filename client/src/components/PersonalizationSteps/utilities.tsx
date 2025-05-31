// src/components/PersonalizationSteps/utilities.tsx
import * as React from "react";
import { FitnessGoal, WeightGoal, ActivityLevel, Budget } from "../../types/personalization";
import { Slider } from "../Slider";

// ────────────────────────────────────────────────────────────
// Step 2 helper: renders the two sliders for weight-based goals.
//   • Target Weight: min=20, max=personalWeight
//   • Time Frame: min = ceil((personalWeight - targetWeight)/2) or 1 if no loss chosen
//               max = 52
//
export const renderGoalWeightInputs = (
  personalWeight: number,               // new parameter
  weightGoal: WeightGoal,
  setWeightGoal: (goal: WeightGoal) => void
) => {
  // Compute how many kilograms the user wants to lose:
  const diff = personalWeight - weightGoal.targetWeight;
  // Using 2 kg/week rule → if diff > 0, at least ceil(diff/2) weeks; if diff <= 0, default to 1.
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
        max={personalWeight}           // clamp to user’s current weight
        unit="kg"
      />

      {/** Time Frame slider **/}
      <Slider
        label="Time Frame"
        value={weightGoal.timeframe}
        onChange={(value) =>
          setWeightGoal({ ...weightGoal, timeframe: value })
        }
        min={minWeeks}                // dynamic minimum
        max={52}
        unit=" weeks"
      />
    </div>
  );
};

// ────────────────────────────────────────────────────────────
// Renders a “Goal Card” for one of four goals, including weight sliders if needed.
// We’ve added personalWeight as the first argument, so that “lose_weight” or “build_muscle”
// can clamp their sliders accordingly.
//
// renderGoalCard signature BEFORE:
//   ( type, icon, title, description, fitnessGoal, setFitnessGoal, weightGoal, setWeightGoal )
//
// renderGoalCard signature NOW:
//   ( personalWeight, type, icon, title, description, fitnessGoal, setFitnessGoal, weightGoal, setWeightGoal )
//
export const renderGoalCard = (
  personalWeight: number,              // new 1st arg
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
        // For weight-related goals, we pass the existing weightGoal in the fitnessGoal payload
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
      Only show the two sliders if:
        • This card is “lose_weight” or “build_muscle”
        • AND it is currently selected (fitnessGoal.type === type)
         Then invoke renderGoalWeightInputs(personalWeight, weightGoal, setWeightGoal).
    **/}
    {(type === "lose_weight" || type === "build_muscle") &&
      fitnessGoal.type === type &&
      renderGoalWeightInputs(personalWeight, weightGoal, setWeightGoal)}
  </button>
);

// ────────────────────────────────────────────────────────────
// (The rest of your helpers remain exactly the same.)
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
