import * as React from "react";
import { FitnessGoal, WeightGoal, ActivityLevel, Budget } from "../../types/personalization";
import { Slider } from "../Slider";

// Helper function to render weight inputs for fitness goals
export const renderGoalWeightInputs = (
  weightGoal: WeightGoal,
  setWeightGoal: (goal: WeightGoal) => void
) => (
  <div className="w-full space-y-4 mt-4">
    <Slider
      label="Target Weight"
      value={weightGoal.targetWeight}
      onChange={(value) => setWeightGoal({ ...weightGoal, targetWeight: value })}
      min={20}
      max={230}
      unit="kg"
    />
    <Slider
      label="Time Frame"
      value={weightGoal.timeframe}
      onChange={(value) => setWeightGoal({ ...weightGoal, timeframe: value })}
      min={4}
      max={52}
      unit=" weeks"
    />
  </div>
);

// Helper function to render fitness goal cards
export const renderGoalCard = (
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
    {(type === "lose_weight" || type === "build_muscle") &&
      fitnessGoal.type === type &&
      renderGoalWeightInputs(weightGoal, setWeightGoal)}
  </button>
);

// Helper function to render preference buttons
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

// Helper function to render activity level cards
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

// Helper function to render budget options
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