// src/components/PersonalizationSteps/Step4.tsx

import React from "react";
import {
  ActivityLevel,
  ActivityType,
  Equipment,
} from "../../types/personalization";
import { renderActivityCard } from "./utilities";

interface Step4Props {
  activityLevel: ActivityLevel;
  setActivityLevel: (level: ActivityLevel) => void;

  activityTypes: ActivityType[];
  setActivityTypes: (types: ActivityType[]) => void;

  equipmentAccess: Equipment[];
  setEquipmentAccess: (eq: Equipment[]) => void;
}

export const Step4 = ({
  activityLevel,
  setActivityLevel,
  activityTypes,
  setActivityTypes,
  equipmentAccess,
  setEquipmentAccess,
}: Step4Props) => {
  // Toggle a single ActivityType in/out of the array:
  const toggleActivityType = (type: ActivityType) => {
    if (activityTypes.includes(type)) {
      setActivityTypes(activityTypes.filter((t) => t !== type));
    } else {
      setActivityTypes([...activityTypes, type]);
    }
  };

  // Toggle a single Equipment in/out of the array,
  // but if user selects "none_equipment" → clear all others.
  const toggleEquipment = (eq: Equipment) => {
    if (eq === "none_equipment") {
      // If clicking “None,” wipe out everything else and leave only "none_equipment"
      setEquipmentAccess(["none_equipment"]);
      return;
    }

    // If the user is clicking a real piece of equipment, we must remove "none_equipment" if it was present:
    let updated = equipmentAccess.filter((e) => e !== "none_equipment");

    if (equipmentAccess.includes(eq)) {
      // If clicking an already‐selected eq, remove it
      updated = updated.filter((e) => e !== eq);
    } else {
      // Otherwise, add this eq to the list
      updated = [...updated, eq];
    }

    // If they haven't selected anything (updated is empty), we can leave updated = []
    setEquipmentAccess(updated);
  };

  // A small “pill” for multi‐select items
  const renderSelectableCard = (
    label: string,
    isSelected: boolean,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-3 py-2 rounded-lg border-[1.5px] text-sm transition-all 
        ${
          isSelected
            ? "bg-light-green border-primary-green text-dark-green"
            : "bg-white border-gray-200 hover:border-primary-green"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      {/** ─────────────────────────────────────────────── 
          Section 1: Activity Level (radio‐style cards)
      ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-dark-green mb-6">
          Activity Level
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            "1–3 hours per week.",
            activityLevel,
            setActivityLevel
          )}
          {renderActivityCard(
            "moderate",
            "Moderate",
            "3–4 hours per week.",
            activityLevel,
            setActivityLevel
          )}
          {renderActivityCard(
            "intense",
            "Intense",
            "4–6 hours per week.",
            activityLevel,
            setActivityLevel
          )}
          {renderActivityCard(
            "very_intense",
            "Very Intense",
            "7+ hours per week.",
            activityLevel,
            setActivityLevel
          )}
        </div>
      </div>

      {/** ─────────────────────────────────────────────── 
          Section 2: “What physical activities do you enjoy?” 
          (multi‐select cards)
      ─────────────────────────────────────────────── */}
      <div>
        <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
          What physical activities do you enjoy?
          <span className="text-sm text-gray-500">(Select all that apply)</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(
            [
              ["running", "Running / Jogging"],
              ["walking", "Walking"],
              ["cycling", "Cycling"],
              ["swimming", "Swimming"],
              ["strength", "Strength Training (Weights)"],
              ["bodyweight", "Bodyweight (Push-ups, Pull-ups, etc.)"],
              ["yoga", "Yoga / Pilates"],
              ["martial_arts", "Martial Arts / Boxing"],
              ["team_sports", "Team Sports (Basketball, Football)"],
              ["dance", "Dance / Zumba"],
              ["hiking", "Hiking / Outdoor activities"],
              ["stretching", "Flexibility / Stretching"],
            ] as [ActivityType, string][]
          ).map(([type, label]) =>
            renderSelectableCard(
              label,
              activityTypes.includes(type),
              () => toggleActivityType(type)
            )
          )}
        </div>
      </div>

      {/** ─────────────────────────────────────────────── 
          Section 3: “Equipment or Locations” 
          (multi‐select cards)
      ─────────────────────────────────────────────── */}
      <div>
        <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
          Do you have access to any equipment or locations?
          <span className="text-sm text-gray-500">(Select all that apply)</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {(
            [
              ["gym", "Gym access"],
              ["dumbbells", "Dumbbells / Weights at home"],
              ["yoga_mat", "Yoga mat"],
              ["resistance_bands", "Resistance bands"],
              ["pool", "Swimming pool"],
              ["bike", "Bike"],
              ["running_track", "Outdoor running track"],
              ["none_equipment", "None – I prefer no-equipment workouts"],
            ] as [Equipment, string][]
          ).map(([eq, label]) =>
            renderSelectableCard(
              label,
              equipmentAccess.includes(eq),
              () => toggleEquipment(eq)
            )
          )}
        </div>
      </div>
    </div>
  );
};
