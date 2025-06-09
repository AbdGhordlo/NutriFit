import React, { useState, useEffect } from "react";
import { ProgressBar } from "../components/ProgressBar";
import { NavigationButtons } from "../components/NavigationButtons";
import { ConfirmationModal } from "../components/ConfirmationModal";
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
import ClipLoader from "react-spinners/ClipLoader";
import ErrorModal from "../components/ErrorModal";
import { getUserIdFromToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { addMeasurement } from "../services/progressService";

function Personalization() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for personalization data
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
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const id = getUserIdFromToken();
    if (id) setUserId(id);
  }, []);

  // Fetch personalization data on component mount
  useEffect(() => {
    if (!userId) return; // Prevent running when userId is not set

    const fetchPersonalizationData = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/personalization/${userId}`,
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
          // Populate state with fetched data
          const { steps_data } = data;
          setPersonalInfo(steps_data.step_1?.personalInfo || personalInfo);
          setFitnessGoal(steps_data.step_2?.fitnessGoal || fitnessGoal);
          setWeightGoal(steps_data.step_2?.weightGoal || weightGoal);
          setCuisinePreferences(
            steps_data.step_3?.cuisinePreferences || cuisinePreferences
          );
          setDietPreference(
            steps_data.step_3?.dietPreference || dietPreference
          );
          setHealthIssues(steps_data.step_3?.healthIssues || healthIssues);
          setMealsPerDay(steps_data.step_3?.mealsPerDay || mealsPerDay);
          setActivityLevel(steps_data.step_4?.activityLevel || activityLevel);
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

  // Save personalization data when a step is completed
  const saveStepData = async (stepNumber: number, stepData: any) => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    setIsLoading(true);
    try {
      // Save height and weight to measurements table on Step 1
      if (stepNumber === 1 && userId) {
        const { height, weight } = stepData.personalInfo;
        await addMeasurement(
          Number(userId),
          "height",
          height,
          "cm",
          new Date(),
          token
        );
        await addMeasurement(
          Number(userId),
          "weight",
          weight,
          "kg",
          new Date(),
          token
        );
      }

      const response = await fetch(
        `http://localhost:5000/personalization/${userId}/step/${stepNumber}`,
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
      console.log("Backend Response:", data); // Log backend response
    } catch (err) {
      setError("Failed to save step data. Please try again.");
      setIsErrorModalOpen(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle next step
  const handleNext = async () => {
    // Save current step data before proceeding
    const stepData = {
      step_1: { personalInfo },
      step_2: { fitnessGoal, weightGoal },
      step_3: {
        cuisinePreferences,
        dietPreference,
        healthIssues,
        mealsPerDay,
      },
      step_4: { activityLevel },
      step_5: { budget, hasKitchenInventory },
    };

    if (currentStep < 5) {
      await saveStepData(currentStep, stepData[`step_${currentStep}`]);
      setCurrentStep((prev) => (prev + 1) as Step);
    } else {
      // This is the "Finish" action
      await saveStepData(5, stepData.step_5);
      console.log("Finish Button in Personalization pressed!");
      if (hasKitchenInventory) {
        navigate("/ingredients");
      } else {
        navigate("/home");
      }
    }
  };

  // Handle back step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  // Handle skip
  const handleSkip = () => {
    setIsSkipModalOpen(true);
  };

  // Handle skip confirmation
  const handleSkipConfirm = async () => {
    setIsSkipModalOpen(false);
    // Save default data if skipped
    await saveStepData(currentStep, {});
  };

  // Conditional rendering for loader, error, or page content
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
        <ClipLoader color="#7ec987" size={50} /> {/* Display the spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={error}
      />
    );
  }

  return (
    <div className="outer-container">
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

        <ConfirmationModal
          isOpen={isSkipModalOpen}
          onClose={() => setIsSkipModalOpen(false)}
          onConfirm={handleSkipConfirm}
          title="Skip Personalization?"
          message="If you skip the personalization steps, you'll receive a standard plan that isn't tailored to your needs and goals."
        />
      </div>
    </div>
  );
}

export default Personalization;
