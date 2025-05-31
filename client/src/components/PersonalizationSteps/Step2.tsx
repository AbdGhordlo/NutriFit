import React, { useEffect } from "react";
import { FitnessGoal, WeightGoal } from "../../types/personalization";
import { renderGoalCard } from "./utilities";
import { CircleGauge, BicepsFlexed, Scale, HeartPulse } from "lucide-react";

interface Step2Props {
  personalWeight: number; 
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

  useEffect(() => {
    setWeightGoal((prev) => ({
      ...prev,
      targetWeight: personalWeight,
    }));
  }, [personalWeight]);

  useEffect(() => {
    // LOSE WEIGHT branch
    if (fitnessGoal.type === "lose_weight") {
      const diff = personalWeight - weightGoal.targetWeight;
      const computedMin = diff > 0 ? Math.ceil(diff / 2) : 1;

      setWeightGoal((prev) => ({
        ...prev,
        timeframe: computedMin,
      }));
    }

    // BUILD MUSCLE branch
    if (fitnessGoal.type === "build_muscle") {
      const diff = weightGoal.targetWeight - personalWeight;
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
          personalWeight,
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
