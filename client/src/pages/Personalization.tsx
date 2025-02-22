import React, { useState } from "react";
import { ProgressBar } from "../components/ProgressBar";
import { NavigationButtons } from "../components/NavigationButtons";
import { Modal } from "../components/Modal";
import { Step1 } from "../components/PersonalizationSteps/Step1";
import { Step2 } from "../components/PersonalizationSteps/Step2";
import { Step3 } from "../components/PersonalizationSteps/Step3";
import { Step4 } from "../components/PersonalizationSteps/Step4";
import { Step5 } from "../components/PersonalizationSteps/Step5";
import {
  PersonalInfo,
  FitnessGoal,
  WeightGoal,
  Cuisine,
  DietPreference,
  HealthIssue,
  ActivityLevel,
  Budget,
  Step,
} from "../types/personalization";

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
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel>("very_light");
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
    setIsSkipModalOpen(false);
  };

  return (
    <div className="h-full bg-pageBackground w-full">
      <div className="mx-auto px-4 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={5} />

        <div className="bg-white p-8 rounded-xl shadow-lg">
          {currentStep === 1 && (
            <Step1
              personalInfo={personalInfo}
              setPersonalInfo={setPersonalInfo}
            />
          )}
          {currentStep === 2 && (
            <Step2
              fitnessGoal={fitnessGoal}
              setFitnessGoal={setFitnessGoal}
              weightGoal={weightGoal}
              setWeightGoal={setWeightGoal}
            />
          )}
          {currentStep === 3 && (
            <Step3
              cuisinePreferences={cuisinePreferences}
              setCuisinePreferences={setCuisinePreferences}
              dietPreference={dietPreference}
              setDietPreference={setDietPreference}
              healthIssues={healthIssues}
              setHealthIssues={setHealthIssues}
              mealsPerDay={mealsPerDay}
              setMealsPerDay={setMealsPerDay}
            />
          )}
          {currentStep === 4 && (
            <Step4
              activityLevel={activityLevel}
              setActivityLevel={setActivityLevel}
            />
          )}
          {currentStep === 5 && (
            <Step5
              budget={budget}
              setBudget={setBudget}
              hasKitchenInventory={hasKitchenInventory}
              setHasKitchenInventory={setHasKitchenInventory}
            />
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
            style={{ fontSize: "14px" }}
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
