import React, { useState } from "react";
import {
  Step,
  PersonalInfo,
  FitnessGoal,
  ActivityLevel,
  Budget,
  WeightGoal,
  Cuisine,
  DietPreference,
  HealthIssue,
} from "../types/personalization";
import { ProgressBar } from "../components/ProgressBar";
import { NavigationButtons } from "../components/NavigationButtons";
import { Slider } from "../components/Slider";
import { Modal } from "../components/Modal";
import {
  UtensilsCrossed,
  BicepsFlexed,
  CircleGauge,
  Salad,
  Scale,
  DollarSign,
  Apple,
  HeartPulse,
  Clock,
} from "lucide-react";

function Personalization() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    height: 60,
    weight: 20,
    gender: "male",
    age: 18,
  });
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>({
    type: "improve_health",
  });
  const [weightGoal, setWeightGoal] = useState<WeightGoal>({
    targetWeight: 20,
    timeframe: 4,
  });
  const [cuisinePreferences, setCuisinePreferences] = useState<Cuisine[]>([]);
  const [dietPreference, setDietPreference] = useState<DietPreference>("none");
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(["none"]);
  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("very_light");
  const [budget, setBudget] = useState<Budget>("basic");
  const [hasKitchenInventory, setHasKitchenInventory] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSkip = () => {
    setIsSkipModalOpen(true);
  };

  const handleSkipConfirm = () => {
    // Handle skip confirmation - you can add your logic here
    setIsSkipModalOpen(false);
  };

  const renderGoalWeightInputs = () => (
    <div className="w-full space-y-4 mt-4">
      <Slider
        label="Target Weight"
        value={weightGoal.targetWeight}
        onChange={(value) =>
          setWeightGoal({ ...weightGoal, targetWeight: value })
        }
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

  const renderGoalCard = (
    type: FitnessGoal["type"],
    icon: React.ReactNode,
    title: string,
    description: string
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
        renderGoalWeightInputs()}
    </button>
  );

  const renderPreferenceButton = (
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

  const renderActivityCard = (
    level: ActivityLevel,
    title: string,
    description: string
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

  const renderBudgetOption = (option: Budget, description: string) => (
    <button
      onClick={() => setBudget(option)}
      className={`w-full p-6 rounded-lg border-2 transition-all ${
        budget === option
          ? "border-primary-green bg-light-green"
          : "border-gray-200 hover:border-primary-green"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-semibold text-dark-green">{option.charAt(0).toUpperCase() + option.slice(1)}</span>
      </div>
      <p className="text-sm text-secondary-text text-left">{description}</p>
    </button>
  );

  return (
    <div className="h-full bg-pageBackground w-full">
      <div className="mx-auto px-4 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={5} />

        <div className="bg-white p-8 rounded-xl shadow-lg">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-dark-green mb-6">
                Basic Information
              </h2>
              <Slider
                label="Height"
                value={personalInfo.height}
                onChange={(value) =>
                  setPersonalInfo({ ...personalInfo, height: value })
                }
                min={60}
                max={280}
                unit="cm"
              />
              <Slider
                label="Weight"
                value={personalInfo.weight}
                onChange={(value) =>
                  setPersonalInfo({ ...personalInfo, weight: value })
                }
                min={20}
                max={230}
                unit="kg"
              />
              <Slider
                label="Age"
                value={personalInfo.age}
                onChange={(value) =>
                  setPersonalInfo({ ...personalInfo, age: value })
                }
                min={18}
                max={120}
                unit=""
              />
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex gap-4">
                  {["male", "female"].map((gender) => (
                    <button
                      key={gender}
                      onClick={() =>
                        setPersonalInfo({
                          ...personalInfo,
                          gender: gender as "male" | "female",
                        })
                      }
                      className={`flex-1 py-2 px-4 rounded-lg border ${
                        personalInfo.gender === gender
                          ? "bg-primary-green text-white border-primary-green"
                          : "border-gray-300 hover:border-primary-green"
                      }`}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-dark-green mb-6">
                Your Goals
              </h2>
              <div className="grid gap-4">
                {renderGoalCard(
                  "lose_weight",
                  <CircleGauge className="w-5 h-5" />,
                  "Lose Weight",
                  "Achieve a healthy weight loss through balanced nutrition and exercise."
                )}
                {renderGoalCard(
                  "build_muscle",
                  <BicepsFlexed className="w-5 h-5" />,
                  "Build Muscle",
                  "Gain lean muscle mass with protein-rich meals and strength training."
                )}
                {renderGoalCard(
                  "body_recomposition",
                  <Scale className="w-5 h-5" />,
                  "Body Recomposition",
                  "Simultaneously lose fat and build muscle through targeted nutrition."
                )}
                {renderGoalCard(
                  "improve_health",
                  <HeartPulse className="w-5 h-5" />,
                  "Improve Health",
                  "Focus on overall wellness and maintaining a balanced lifestyle."
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-dark-green mb-6">
                Dietary Preferences
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5" />
                    Favorite Cuisines
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        "mediterranean",
                        "asian",
                        "american",
                        "indian",
                        "mexican",
                      ] as const
                    ).map((cuisine) => (
                      <div key={cuisine}>
                        {renderPreferenceButton(
                          cuisine,
                          cuisine.charAt(0).toUpperCase() + cuisine.slice(1),
                          cuisinePreferences.includes(cuisine),
                          () =>
                            setCuisinePreferences(
                              cuisinePreferences.includes(cuisine)
                                ? cuisinePreferences.filter(
                                    (c) => c !== cuisine
                                  )
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
                    {(
                      ["none", "vegetarian", "vegan", "keto", "paleo"] as const
                    ).map((diet) => (
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
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-dark-green mb-3 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5" />
                    Health Considerations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(["none", "diabetes", "allergies", "celiac"] as const).map(
                      (issue) => (
                        <div key={issue}>
                          {renderPreferenceButton(
                            issue,
                            issue === "none"
                              ? "None"
                              : issue.charAt(0).toUpperCase() + issue.slice(1),
                            healthIssues.includes(issue),
                            () => {
                              if (issue === "none") {
                                setHealthIssues(["none"]);
                              } else {
                                setHealthIssues(
                                  healthIssues.includes(issue)
                                    ? healthIssues.filter((i) => i !== issue)
                                    : [
                                        ...healthIssues.filter(
                                          (i) => i !== "none"
                                        ),
                                        issue,
                                      ]
                                );
                              }
                            }
                          )}
                        </div>
                      )
                    )}
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
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-dark-green mb-6">
                Activity Level
              </h2>
              <div className="grid gap-4">
                {renderActivityCard(
                  "very_light",
                  "Very Light",
                  "Almost no purposeful exercise."
                )}
                {renderActivityCard("light", "Light", "1-3 hours per week.")}
                {renderActivityCard(
                  "moderate",
                  "Moderate",
                  "3-4 hours per week."
                )}
                {renderActivityCard(
                  "intense",
                  "Intense",
                  "4-6 hours per week."
                )}
                {renderActivityCard(
                  "very_intense",
                  "Very Intense",
                  "7 or more hours per week."
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-dark-green mb-6">
                Budget & Kitchen
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-dark-green mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Monthly Food Budget
                  </h3>
                  <div className="grid gap-4">
                    {renderBudgetOption("basic", "$100 - $200 per month")}
                    {renderBudgetOption("standard", "$200 - $400 per month")}
                    {renderBudgetOption("premium", "$400 - $600 per month")}
                    {renderBudgetOption("luxury", "$600+ per month")}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-dark-green mb-4 flex items-center gap-2">
                    <Apple className="w-5 h-5" />
                    Kitchen Inventory
                  </h3>
                  <button
                    onClick={() => setHasKitchenInventory(!hasKitchenInventory)}
                    className={`w-full p-6 rounded-lg border-2 text-left transition-all ${
                      hasKitchenInventory
                        ? "border-primary-green bg-light-green"
                        : "border-gray-200 hover:border-primary-green"
                    }`}
                  >
                    <h4 className="text-base font-medium text-dark-green mb-2">
                      Add Your Kitchen Inventory
                    </h4>
                    <p className="text-sm text-secondary-text">
                      Let us know what ingredients you already have to get
                      better meal recommendations.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="w-full mt-8">
            <NavigationButtons
              onNext={handleNext}
              onBack={handleBack}
              canGoBack={currentStep > 1}
              isLastStep={currentStep === 5}
            />
          </div>

          <button
            onClick={handleSkip}
            className="w-full flex items-center justify-center mt-4 text-gray-500 hover:text-dark-green transition-colors"
            style={{
              fontSize: "14px",
            }}
          >
            Skip personalization steps
          </button>
        </div>
      </div>

      <Modal
        isOpen={isSkipModalOpen}
        onClose={() => setIsSkipModalOpen(false)}
        onConfirm={handleSkipConfirm}
        title="Skip Personalization?"
        message="If you skip the personalization steps, you'll receive a standard plan that isn't tailored to your needs and goals."
      />
    </div>
  );
}

export default Personalization;
