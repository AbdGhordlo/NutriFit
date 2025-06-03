// src/components/PersonalizationSteps/utilities.tsx

import * as React from "react";
import {
  FitnessGoal,
  WeightGoal,
  ActivityLevel,
  ActivityType,
  Equipment,
  Budget,
} from "../../types/personalization";
import { Slider } from "../Slider";

/**
 * Renders the two sliders under “Lose Weight,” “Build Muscle” or “Body Recomposition.”
 * For “Lose Weight”: 
 *   • Target Weight ∈ [20, personalWeight]
 *   • Time Frame ∈ [ceil((personalWeight – targetWeight)/2), ceil((personalWeight–20)/2)]
 *
 * For “Build Muscle”:
 *   • Target Weight ∈ [personalWeight, personalWeight+50]
 *   • Time Frame ∈ [ceil((targetWeight – personalWeight)/2), ceil(50/2)]  // 25 weeks max
 *
 * For “Body Recomposition”:
 *   • Target Weight ∈ [personalWeight–10, personalWeight+10] 
 *     (clamped to ≥20kg on the lower bound)
 *   • Time Frame ∈ [computedMinRecomp, 24] where
 *       – diff = |personalWeight – targetWeight|
 *       – computedMinRecomp = diff>0 ? ceil(diff/1) : 4
 *       – maxRecompWeeks = 24
 */
export const renderGoalWeightInputs = (
  personalWeight: number,
  weightGoal: WeightGoal,
  setWeightGoal: (goal: WeightGoal) => void,
  goalType: FitnessGoal["type"]
) => {
  // ── LOSE WEIGHT ───────────────────────────────────────────────────────────
  if (goalType === "lose_weight") {
    const diffLose = personalWeight - weightGoal.targetWeight;
    // Minimum weeks = ceil(diffLose/2) if diffLose>0, else 1
    const minLoseWeeks = diffLose > 0 ? Math.ceil(diffLose / 2) : 1;
    // Maximum possible loss at 2kg/week is (personalWeight–20)/2
    const maxLoseWeeks = Math.ceil((personalWeight - 20) / 2);

    return (
      <div className="w-full space-y-4 mt-4">
        {/**** Target Weight ****/}
        <Slider
          label="Target Weight"
          value={weightGoal.targetWeight}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, targetWeight: value })
          }
          min={20}
          max={personalWeight}
          unit="kg"
        />

        {/**** Time Frame ****/}
        <Slider
          label="Time Frame"
          value={weightGoal.timeframe}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, timeframe: value })
          }
          min={minLoseWeeks}
          max={maxLoseWeeks}
          unit=" weeks"
        />
      </div>
    );
  }

  // ── BUILD MUSCLE ─────────────────────────────────────────────────────────
  if (goalType === "build_muscle") {
    // We still take personalWeight as the minimum bound…
    // but the maximum bound is now hard‐capped at 230 kg (no higher).
    const minWeightGain = personalWeight;
    const maxWeightGain = 230;

    // Compute how many kg above personalWeight the user is targeting
    const diffGain = weightGoal.targetWeight - personalWeight;
    // Minimum weeks = ceil(diffGain/2) if diffGain > 0, else 1
    const minGainWeeks = diffGain > 0 ? Math.ceil(diffGain / 2) : 1;
    // We no longer allow >230kg, so max gain is just 230 – personalWeight, at 2kg/week:
    // But as an absolute cap, we’ll keep max weeks = ceil((230 – personalWeight)/2).
    // If you prefer a flat “25 weeks” cap regardless of personalWeight, you can still hard‐code 25.
    const maxGainWeeks = Math.ceil((maxWeightGain - personalWeight) / 2);

    return (
      <div className="w-full space-y-4 mt-4">
        {/**** Target Weight ****/}
        <Slider
          label="Target Weight"
          value={weightGoal.targetWeight}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, targetWeight: value })
          }
          min={minWeightGain}
          max={maxWeightGain}
          unit="kg"
        />

        {/**** Time Frame ****/}
        <Slider
          label="Time Frame"
          value={weightGoal.timeframe}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, timeframe: value })
          }
          min={minGainWeeks}
          max={maxGainWeeks}
          unit=" weeks"
        />
      </div>
    );
  }

  // ── BODY RECOMPOSITION ────────────────────────────────────────────────────
  if (goalType === "body_recomposition") {
    // ±10 kg window around personalWeight
    const minWeight = personalWeight - 10;
    const maxWeight = personalWeight + 10;
    // Ensure minWeight is at least 20 (clamp so user cannot go below 20kg)
    const clampedMinWeight = minWeight > 20 ? minWeight : 20;

    // Compute the absolute difference
    const diff = Math.abs(personalWeight - weightGoal.targetWeight);
    // If diff > 0, minimum = ceil(diff/1) (1 kg/week combined pace)
    // If diff = 0, force at least 4 weeks
    const minRecompWeeks = diff > 0 ? Math.ceil(diff / 1) : 4;
    // Cap the max at 24 weeks
    const maxRecompWeeks = 24;

    return (
      <div className="w-full space-y-4 mt-4">
        {/**** Target Weight ****/}
        <Slider
          label="Target Weight"
          value={weightGoal.targetWeight}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, targetWeight: value })
          }
          min={clampedMinWeight}
          max={maxWeight}
          unit="kg"
        />

        {/**** Time Frame ****/}
        <Slider
          label="Time Frame"
          value={weightGoal.timeframe}
          onChange={(value) =>
            setWeightGoal({ ...weightGoal, timeframe: value })
          }
          min={minRecompWeeks}
          max={maxRecompWeeks}
          unit=" weeks"
        />
      </div>
    );
  }

  // ── OTHERWISE (e.g. improve_health) ────────────────────────────────────────
  return null;
};

/**
 * Renders one of the four “Goal Cards” (Lose Weight, Build Muscle, Body Recomposition, Improve Health).
 * If the selected type is lose_weight/build_muscle/body_recomposition,
 *   it will render the appropriate pair of sliders (via renderGoalWeightInputs).
 */
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
      if (type === "lose_weight" || type === "build_muscle" || type === "body_recomposition") {
        // Pass along the existing weightGoal object so that Step2 can manipulate it
        setFitnessGoal({ type, goal: weightGoal });
      } else {
        // improve_health or any other non‐weight goal
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

    {(type === "lose_weight" || type === "build_muscle" || type === "body_recomposition") &&
      fitnessGoal.type === type &&
      renderGoalWeightInputs(personalWeight, weightGoal, setWeightGoal, type)}
  </button>
);

// ────────────────────────────────────────────────────────────────────────────
// The rest of your helpers (renderActivityCard, renderPreferenceButton, renderBudgetOption)
// remain exactly as before—no changes needed there.
// For completeness, here they are unchanged:
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
