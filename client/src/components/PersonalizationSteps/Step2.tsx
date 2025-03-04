import React from "react";
import { FitnessGoal, WeightGoal } from "../../types/personalization";
import { renderGoalCard } from "./utilities";
import { CircleGauge, BicepsFlexed, Scale, HeartPulse } from "lucide-react";

interface Step2Props {
  fitnessGoal: FitnessGoal;
  setFitnessGoal: (goal: FitnessGoal) => void;
  weightGoal: WeightGoal;
  setWeightGoal: (goal: WeightGoal) => void;
}

export const Step2 = ({
  fitnessGoal,
  setFitnessGoal,
  weightGoal,
  setWeightGoal,
}: Step2Props) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-dark-green mb-6">Your Goals</h2>
    <div className="grid gap-4">
      {renderGoalCard(
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