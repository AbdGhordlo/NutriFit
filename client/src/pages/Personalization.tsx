// src/pages/Personalization.tsx

import React, { useState, useEffect } from "react";
import { ProgressBar } from "../components/ProgressBar";
import { NavigationButtons } from "../components/NavigationButtons";
import { ConfirmationModal } from "../components/ConfirmationModal";
import ErrorPopupModal from "../components/ErrorPopupModal";
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
  ActivityType,
  Equipment,
  Budget,
  Step,
} from "../types/personalization";
import ClipLoader from "react-spinners/ClipLoader";
import ErrorModal from "../components/ErrorModal";
import { getUserIdFromToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { addMeasurement } from "../services/progressService";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Personalization() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Step 1 State ─────────────────────────────────────────────────────
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    height: 60,
    weight: 20,
    gender: "male",
    age: 18,
  });

  // ─── Step 2 State ─────────────────────────────────────────────────────
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>({
    type: "improve_health",
  });
  const [weightGoal, setWeightGoal] = useState<WeightGoal>({
    targetWeight: 20,
    timeframe: 4,
  });

  // ─── Step 3 State ─────────────────────────────────────────────────────
  const [cuisinePreferences, setCuisinePreferences] = useState<Cuisine[]>([]);
  const [dietPreference, setDietPreference] = useState<DietPreference>("none");
  const [healthIssues, setHealthIssues] = useState<HealthIssue[]>(["none"]);
  const [specificAllergies, setSpecificAllergies] = useState<string[]>([]);
  const [mealsPerDay, setMealsPerDay] = useState(2);

  // ─── Step 4 State ─────────────────────────────────────────────────────
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevel>("very_light");
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [equipmentAccess, setEquipmentAccess] = useState<Equipment[]>([]);

  // ─── Step 5 State ─────────────────────────────────────────────────────
  const [budget, setBudget] = useState<Budget>("basic");
  const [hasKitchenInventory, setHasKitchenInventory] = useState(false);

  // ─── Misc ─────────────────────────────────────────────────────────────
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const token = localStorage.getItem("token");

  // ─── On Mount: grab userId from token ─────────────────────────────────
  useEffect(() => {
    const id = getUserIdFromToken();
    if (id) setUserId(id);
  }, []);

  // ─── Fetch all personalization data if we have a userId ───────────────
  useEffect(() => {
    if (!userId) return;

    const fetchPersonalizationData = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/personalization/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.steps_data) {
          const { steps_data } = data;

          // Step 1
          setPersonalInfo(steps_data.step_1?.personalInfo || personalInfo);

          // Step 2
          setFitnessGoal(steps_data.step_2?.fitnessGoal || fitnessGoal);
          setWeightGoal(steps_data.step_2?.weightGoal || weightGoal);

          // Step 3
          setCuisinePreferences(
            steps_data.step_3?.cuisinePreferences || cuisinePreferences
          );
          setDietPreference(
            steps_data.step_3?.dietPreference || dietPreference
          );
          setHealthIssues(steps_data.step_3?.healthIssues || healthIssues);
          setSpecificAllergies(steps_data.step_3?.specificAllergies || []);
          setMealsPerDay(steps_data.step_3?.mealsPerDay || mealsPerDay);

          // Step 4
          setActivityLevel(steps_data.step_4?.activityLevel || activityLevel);
          setActivityTypes(steps_data.step_4?.activityTypes || []);
          setEquipmentAccess(steps_data.step_4?.equipmentAccess || []);

          // Step 5
          setBudget(steps_data.step_5?.budget || budget);
          setHasKitchenInventory(
            steps_data.step_5?.hasKitchenInventory || hasKitchenInventory
          );
        }
      } catch (err) {
        setError("Failed to fetch personalization data. Please try again.");
        setIsErrorModalOpen(true);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalizationData();
  }, [token, userId]);

  // ─── Save a given step’s data to the backend ──────────────────────────
  const saveStepData = async (stepNumber: number, stepData: any) => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    setIsLoading(true);
    try {
      console.log(`Saving Step ${stepNumber} Data:`, stepData);

      // If saving Step 1, also add weight and height to body measurement table
      if (stepNumber === 1 && userId) {
        const { height, weight } = stepData.personalInfo;
        const now = new Date().toISOString();
        // Add weight measurement
        await addMeasurement(
          Number(userId),
          "weight",
          weight,
          "kg",
          now,
          token
        );
        // Add height measurement
        await addMeasurement(
          Number(userId),
          "height",
          height,
          "cm",
          now,
          token
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/personalization/${userId}/step/${stepNumber}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ steps_data: stepData }),
        }
      );
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Backend Response:", data);
    } catch (err) {
      setError("Failed to save step data. Please try again.");
      setIsErrorModalOpen(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── “Next” button handler, with allergy‐validation for Step 3 ──────────
  const handleNext = async () => {
    // If on Step 3 and user selected “allergies” but no specificAllergies:
    if (
      currentStep === 3 &&
      healthIssues.includes("allergies") &&
      specificAllergies.length === 0
    ) {
      setError("Please select at least one allergen before proceeding.");
      setIsErrorModalOpen(true);
      return;
    }

    // ─── Step 4: ensure at least one activity type AND at least one equipment is chosen ───
    if (currentStep === 4) {
      if (activityTypes.length === 0) {
        setError(
          "Please select at least one physical activity before proceeding."
        );
        setIsErrorModalOpen(true);
        return;
      }

      if (equipmentAccess.length === 0) {
        setError(
          "Please select at least one equipment/location or choose 'None' before proceeding."
        );
        setIsErrorModalOpen(true);
        return;
      }
    }

    // Gather step‐data up to the current step:
    const stepData = {
      step_1: { personalInfo },
      step_2: { fitnessGoal, weightGoal },
      step_3: {
        cuisinePreferences,
        dietPreference,
        healthIssues,
        mealsPerDay,
        specificAllergies, // newly added field
      },
      step_4: {
        activityLevel,
        activityTypes,
        equipmentAccess,
      },
      step_5: { budget, hasKitchenInventory },
    };

    if (currentStep < 5) {
      await saveStepData(currentStep, stepData[`step_${currentStep}`]);
      setCurrentStep((prev) => (prev + 1) as Step);
    } else {
      // Finished all steps; if user has kitchen inventory, go to /ingredients, else /home
      await saveStepData(5, stepData.step_5);
      if (hasKitchenInventory) {
        navigate("/ingredients");
      } else {
        navigate("/home");
      }
    }
  };

  // ─── “Back” button handler ────────────────────────────────────────────
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  // ─── “Skip” and “Skip Confirm” ───────────────────────────────────────
  const handleSkip = () => setIsSkipModalOpen(true);
  const handleSkipConfirm = async () => {
    setIsSkipModalOpen(false);
    // Save all steps' data before skipping
    const stepData = {
      step_1: { personalInfo },
      step_2: { fitnessGoal, weightGoal },
      step_3: {
        cuisinePreferences,
        dietPreference,
        healthIssues,
        mealsPerDay,
        specificAllergies,
      },
      step_4: {
        activityLevel,
        activityTypes,
        equipmentAccess,
      },
      step_5: { budget, hasKitchenInventory },
    };
    try {
      await saveStepData(currentStep, stepData[`step_${currentStep}`]);
      navigate("/home");
    } catch (e) {
      // Optionally handle error
    }
  };

  // ─── Show loader if fetching or saving ───────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#7ec987" size={50} />
      </div>
    );
  }

  // ─── Render the correct Step component ───────────────────────────────
  return (
    <div className="outer-container">
      <div className="h-full bg-pageBackground w-full">
        <div className="mx-auto px-4 py-8">
          <ProgressBar currentStep={currentStep} totalSteps={5} />

          <div className="bg-white p-8 rounded-xl shadow-lg">
            {/** Step 1: Basic Info **/}
            {currentStep === 1 && (
              <Step1
                personalInfo={personalInfo}
                setPersonalInfo={setPersonalInfo}
              />
            )}

            {/** Step 2: Your Goals **/}
            {currentStep === 2 && (
              <Step2
                personalWeight={personalInfo.weight}
                fitnessGoal={fitnessGoal}
                setFitnessGoal={setFitnessGoal}
                weightGoal={weightGoal}
                setWeightGoal={setWeightGoal}
              />
            )}

            {/** Step 3: Dietary Preferences **/}
            {currentStep === 3 && (
              <Step3
                cuisinePreferences={cuisinePreferences}
                setCuisinePreferences={setCuisinePreferences}
                dietPreference={dietPreference}
                setDietPreference={setDietPreference}
                healthIssues={healthIssues}
                setHealthIssues={setHealthIssues}
                specificAllergies={specificAllergies}
                setSpecificAllergies={setSpecificAllergies}
                mealsPerDay={mealsPerDay}
                setMealsPerDay={setMealsPerDay}
              />
            )}

            {/** Step 4: Activity Level & Preferences **/}
            {currentStep === 4 && (
              <Step4
                activityLevel={activityLevel}
                setActivityLevel={setActivityLevel}
                activityTypes={activityTypes}
                setActivityTypes={setActivityTypes}
                equipmentAccess={equipmentAccess}
                setEquipmentAccess={setEquipmentAccess}
              />
            )}

            {/** Step 5: Budget & Kitchen Inventory **/}
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
        <ConfirmationModal
          isOpen={isSkipModalOpen}
          onClose={() => setIsSkipModalOpen(false)}
          onConfirm={handleSkipConfirm}
          title="Skip Personalization?"
          message="If you skip the personalization steps, you'll receive a standard plan that isn't tailored to your needs and goals."
        />
        <ErrorPopupModal
          isOpen={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
          message={error || ""}
          title="Warning!"
          type="error"
        />
      </div>
    </div>
  );
}

export default Personalization;
