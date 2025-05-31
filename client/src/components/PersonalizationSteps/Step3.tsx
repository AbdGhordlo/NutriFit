// src/components/PersonalizationSteps/Step3.tsx

import React, { useState, useEffect } from "react";
import { Cuisine, DietPreference, HealthIssue } from "../../types/personalization";
import { renderPreferenceButton } from "./utilities";
import { UtensilsCrossed, Salad, HeartPulse, Clock } from "lucide-react";
import { Slider } from "../Slider";

// List of specific allergens we want users to choose from:
const ALLERGEN_OPTIONS = [
  "Peanuts",
  "Tree Nuts",
  "Dairy",
  "Eggs",
  "Soy",
  "Wheat/Gluten",
  "Shellfish",
  "Fish",
  "Sesame",
];

interface Step3Props {
  cuisinePreferences: Cuisine[];
  setCuisinePreferences: (cuisines: Cuisine[]) => void;
  dietPreference: DietPreference;
  setDietPreference: (preference: DietPreference) => void;

  // Existing healthIssues state (e.g. ["none"], ["allergies"], ["celiac"])
  healthIssues: HealthIssue[];
  setHealthIssues: (issues: HealthIssue[]) => void;

  // ↓ NEW: we now accept specificAllergies & its setter from the parent
  specificAllergies: string[];
  setSpecificAllergies: (allergies: string[]) => void;

  mealsPerDay: number;
  setMealsPerDay: (meals: number) => void;
}

export const Step3 = ({
  cuisinePreferences,
  setCuisinePreferences,
  dietPreference,
  setDietPreference,
  healthIssues,
  setHealthIssues,

  // ↓ DESCTRUCTURE the lifted props:
  specificAllergies,
  setSpecificAllergies,

  mealsPerDay,
  setMealsPerDay,
}: Step3Props) => {
  // We no longer keep specificAllergies in local state; it is lifted.

  // Handler for when the user clicks a “health issue” button
  const toggleHealthIssue = (issue: HealthIssue) => {
    if (issue === "none") {
      // Selecting “None” should wipe out everything else, including any specificAllergies
      setHealthIssues(["none"]);
      setSpecificAllergies([]);
      return;
    }

    // If “none” is already in the list, remove it first
    let updated = healthIssues.filter((i) => i !== "none");

    if (healthIssues.includes(issue)) {
      // If clicking a selected issue → remove it
      updated = updated.filter((i) => i !== issue);

      // If they un‐checked “allergies,” clear specificAllergies
      if (issue === "allergies") {
        setSpecificAllergies([]);
      }
    } else {
      // Otherwise, add it
      updated = [...updated, issue];
    }

    // If nothing remains selected, default back to “none”
    if (updated.length === 0) {
      updated = ["none"];
    }

    setHealthIssues(updated);
  };

  // Handler for a specific allergen checkbox toggle
  const toggleAllergen = (allergen: string) => {
    if (specificAllergies.includes(allergen)) {
      setSpecificAllergies(specificAllergies.filter((a) => a !== allergen));
    } else {
      setSpecificAllergies([...specificAllergies, allergen]);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-dark-green mb-6">Dietary Preferences</h2>

      <div className="space-y-6">
        {/* ------------------------------------------------ */}
        {/* Favorite Cuisines */}
        {/* ------------------------------------------------ */}
        <div>
          <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            Favorite Cuisines
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["mediterranean", "asian", "american", "indian", "mexican"] as const).map(
              (cuisine) => (
                <div key={cuisine}>
                  {renderPreferenceButton(
                    cuisine,
                    cuisine.charAt(0).toUpperCase() + cuisine.slice(1),
                    cuisinePreferences.includes(cuisine),
                    () =>
                      setCuisinePreferences(
                        cuisinePreferences.includes(cuisine)
                          ? cuisinePreferences.filter((c) => c !== cuisine)
                          : [...cuisinePreferences, cuisine]
                      )
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Diet Preferences */}
        {/* ------------------------------------------------ */}
        <div>
          <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
            <Salad className="w-5 h-5" />
            Diet Preferences
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["none", "vegetarian", "vegan", "keto", "paleo"] as const).map(
              (diet) => (
                <div key={diet}>
                  {renderPreferenceButton(
                    diet,
                    diet === "none"
                      ? "No Restrictions"
                      : diet.charAt(0).toUpperCase() + diet.slice(1),
                    dietPreference === diet,
                    () => setDietPreference(diet)
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* Health Considerations */}
        {/* ------------------------------------------------ */}
        <div>
          <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
            <HeartPulse className="w-5 h-5" />
            Health Considerations
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["none", "allergies", "celiac"] as const).map((issue) => (
              <div key={issue}>
                {renderPreferenceButton(
                  issue,
                  // Display “Allergies” as “Allergies & Intolerances”
                  issue === "allergies"
                    ? "Allergies & Intolerances"
                    : issue === "celiac"
                    ? "Celiac Disease"
                    : "None",
                  healthIssues.includes(issue),
                  () => toggleHealthIssue(issue)
                )}
              </div>
            ))}
          </div>

          {/* If the user has chosen “allergies,” show the inline panel */}
          {healthIssues.includes("allergies") && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="mb-2 text-sm text-gray-700">
                Which of the following allergens apply?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ALLERGEN_OPTIONS.map((allergen) => (
                  <label
                    key={allergen}
                    className="flex items-center gap-2 text-sm text-gray-800"
                  >
                    <input
                      type="checkbox"
                      checked={specificAllergies.includes(allergen)}
                      onChange={() => toggleAllergen(allergen)}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                    {allergen}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------ */}
        {/* Meals per Day */}
        {/* ------------------------------------------------ */}
        <div>
          <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Meals per Day
          </h3>
          <Slider
            label="Number of Meals"
            value={mealsPerDay}
            onChange={setMealsPerDay}
            min={2}
            max={6}
            unit=""
          />
        </div>
      </div>
    </div>
  );
};
