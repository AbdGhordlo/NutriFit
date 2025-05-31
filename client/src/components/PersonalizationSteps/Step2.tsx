// src/components/PersonalizationSteps/Step2.tsx

import React, { useEffect } from "react";
import { FitnessGoal, WeightGoal } from "../../types/personalization";
import { renderGoalCard } from "./utilities";
import { CircleGauge, BicepsFlexed, Scale, HeartPulse } from "lucide-react";

interface Step2Props {
  personalWeight: number;                   // The user’s current weight from Page 1
  fitnessGoal: FitnessGoal;
  setFitnessGoal: (goal: FitnessGoal) => void;
  weightGoal: WeightGoal;
  setWeightGoal: (goal: WeightGoal) => void;
}

export const Step2 = ({
  personalWeight,
  fitnessGoal,
  setFitnessGoal,
  weightGoal,
  setWeightGoal,
}: Step2Props) => {
  //
  // 1) Whenever personalWeight changes (i.e. step1 updated), immediately reset
  //    weightGoal.targetWeight to that new personalWeight. This ensures the
  //    “Target Weight” label/text always matches the slider’s max when you arrive.
  //
  useEffect(() => {
    setWeightGoal((prev) => ({
      ...prev,
      targetWeight: personalWeight,
    }));
  }, [personalWeight]);

  //
  // 2) Whenever targetWeight changes under “Lose Weight,” recalc the minimum
  //    timeframe = ceil((personalWeight – targetWeight) / 2) or 1 if no diff.
  //    Then immediately set weightGoal.timeframe to that minimum so the label
  //    and thumb on the Time Frame slider update in sync.
  //
  useEffect(() => {
    if (fitnessGoal.type === "lose_weight") {
      const diff = personalWeight - weightGoal.targetWeight;
      const computedMin = diff > 0 ? Math.ceil(diff / 2) : 1;
      setWeightGoal((prev) => ({
        ...prev,
        timeframe: computedMin,
      }));
    }
  }, [weightGoal.targetWeight, personalWeight, fitnessGoal.type]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark-green mb-6">Your Goals</h2>
      <div className="grid gap-4">
        {renderGoalCard(
          personalWeight,                   // Pass the up-to-date current weight
          "lose_weight",
          <CircleGauge className="w-5 h-5" />,
          "Lose Weight",
          "Achieve a healthy weight loss through balanced nutrition and exercise.",
          fitnessGoal,
          setFitnessGoal,
          weightGoal,
          setWeightGoal
        )}
        {renderGoalCard(
          personalWeight,
          "build_muscle",
          <BicepsFlexed className="w-5 h-5" />,
          "Build Muscle",
          "Gain lean muscle mass with protein-rich meals and strength training.",
          fitnessGoal,
          setFitnessGoal,
          weightGoal,
          setWeightGoal
        )}
        {renderGoalCard(
          personalWeight,
          "body_recomposition",
          <Scale className="w-5 h-5" />,
          "Body Recomposition",
          "Simultaneously lose fat and build muscle through targeted nutrition.",
          fitnessGoal,
          setFitnessGoal,
          weightGoal,
          setWeightGoal
        )}
        {renderGoalCard(
          personalWeight,
          "improve_health",
          <HeartPulse className="w-5 h-5" />,
          "Improve Health",
          "Focus on overall wellness and maintaining a balanced lifestyle.",
          fitnessGoal,
          setFitnessGoal,
          weightGoal,
          setWeightGoal
        )}
      </div>
    </div>
  );
};
