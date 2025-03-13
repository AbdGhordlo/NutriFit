import React from "react";
import { Cuisine, DietPreference, HealthIssue } from "../../types/personalization";
import { renderPreferenceButton } from "./utilities";
import { UtensilsCrossed, Salad, HeartPulse, Clock } from "lucide-react";
import { Slider } from "../Slider";

interface Step3Props {
  cuisinePreferences: Cuisine[];
  setCuisinePreferences: (cuisines: Cuisine[]) => void;
  dietPreference: DietPreference;
  setDietPreference: (preference: DietPreference) => void;
  healthIssues: HealthIssue[];
  setHealthIssues: (issues: HealthIssue[]) => void;
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
  mealsPerDay,
  setMealsPerDay,
}: Step3Props) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-dark-green mb-6">Dietary Preferences</h2>

    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5" />
          Favorite Cuisines
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["mediterranean", "asian", "american", "indian", "mexican"] as const).map((cuisine) => (
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
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
          <Salad className="w-5 h-5" />
          Diet Preferences
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["none", "vegetarian", "vegan", "keto", "paleo"] as const).map((diet) => (
            <div key={diet}>
              {renderPreferenceButton(
                diet,
                diet === "none" ? "No Restrictions" : diet.charAt(0).toUpperCase() + diet.slice(1),
                dietPreference === diet,
                () => setDietPreference(diet)
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
          <HeartPulse className="w-5 h-5" />
          Health Considerations
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["none", "diabetes", "allergies", "celiac"] as const).map((issue) => (
            <div key={issue}>
              {renderPreferenceButton(
                issue,
                issue === "none" ? "None" : issue.charAt(0).toUpperCase() + issue.slice(1),
                healthIssues.includes(issue),
                () => {
                  if (issue === "none") {
                    setHealthIssues(["none"]);
                  } else {
                    setHealthIssues(
                      healthIssues.includes(issue)
                        ? healthIssues.filter((i) => i !== issue)
                        : [...healthIssues.filter((i) => i !== "none"), issue]
                    );
                  }
                }
              )}
            </div>
          ))}
        </div>
      </div>

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