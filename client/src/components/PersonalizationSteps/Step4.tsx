import React from "react";
import { ActivityLevel } from "../../types/personalization";
import { renderActivityCard } from "./utilities";

interface Step4Props {
  activityLevel: ActivityLevel;
  setActivityLevel: (level: ActivityLevel) => void;
}

export const Step4 = ({ activityLevel, setActivityLevel }: Step4Props) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-dark-green mb-6">Activity Level</h2>
    <div className="grid gap-4">
      {renderActivityCard(
        "very_light",
        "Very Light",
        "Almost no purposeful exercise.",
        activityLevel,
        setActivityLevel
      )}
      {renderActivityCard(
        "light",
        "Light",
        "1-3 hours per week.",
        activityLevel,
        setActivityLevel
      )}
      {renderActivityCard(
        "moderate",
        "Moderate",
        "3-4 hours per week.",
        activityLevel,
        setActivityLevel
      )}
      {renderActivityCard(
        "intense",
        "Intense",
        "4-6 hours per week.",
        activityLevel,
        setActivityLevel
      )}
      {renderActivityCard(
        "very_intense",
        "Very Intense",
        "7 or more hours per week.",
        activityLevel,
        setActivityLevel
      )}
    </div>
  </div>
);