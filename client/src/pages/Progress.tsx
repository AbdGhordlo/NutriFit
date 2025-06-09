import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MotivationalQuote from "../components/ProgressComponents/MotivationalQuote";
import StreakTracker from "../components/ProgressComponents/StreakTracker";
import AnthropometricMeasurements from "../components/ProgressComponents/AnthropometricMeasurements";
import GoalTracker from "../components/ProgressComponents/GoalTracker";
import ProgressPhotos from "../components/ProgressComponents/ProgressPhotos";
import { getUserIdFromToken } from "../utils/auth";
import { useAuth } from "../utils/useAuth";
import { useAnthropometricData } from "../hooks/progress/useAnthropometricData";
import { useStreakData } from "../hooks/progress/useStreakData";
import * as personalizationService from "../services/personalizationService";
import { useGoalDates } from "../hooks/progress/useGoalDates";
import { usePenaltyDays } from "../hooks/progress/usePenaltyDays";


const Progress = () => {
  const [quote, setQuote] = useState({ quote: "", author: "" });
  const [photos, setPhotos] = useState([]);
  const [goalData, setGoalData] = useState<any>(null);
  const userId = getUserIdFromToken();
  const { getAuthToken } = useAuth();
  const token = getAuthToken() || "";
  const today = new Date().toISOString().slice(0, 10);

  // Use the custom hook for anthropometric data
  const {
    weightHistory,
    heightHistory,
    waistHistory,
    hipHistory,
    fatMassHistory,
    leanMassHistory,
    currentWeight,
    currentHeight,
    currentWaist,
    currentHip,
    currentFatMass,
    currentLeanMass,
    loading: anthropoLoading,
    error: anthropoError,
    saveMeasurement,
  } = useAnthropometricData(userId, token);

  // Use the custom hook for streak data
  const {
    dailyCompletedMeals,
    dailyMaxMeals,
    dailyCompletedExercises,
    dailyMaxExercises,
    dailyCompletedDays,
    weeklyCurrent,
    weeklyMax,
    monthlyCurrent,
    monthlyMax,
    totalTimeframeWeeks,
    loading: streakLoading,
    error: streakError,
  } = useStreakData(userId, token, today);

  // Use custom hook for fetching goal dates data
  const { startDate, targetDate, adjustedTargetDate } = useGoalDates(
    userId,
    token
  );

  // Use custom hook for fetching penalty days
  const { penaltyDaysCount } = usePenaltyDays(userId, token);

  // Animation variants for page elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    fetch("https://quotes-api-self.vercel.app/quote")
      .then((response) => response.json())
      .then((data) => {
        setQuote({ quote: data.quote, author: data.author });
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const fetchGoalData = async () => {
      if (!userId || !token) return;
      try {
        const data = await personalizationService.fetchPersonalizationData(
          userId,
          token
        );
        const step2 = data?.steps_data?.step_2;
        let targetWeight = undefined;
        if (step2?.fitnessGoal?.goal?.targetWeight) {
          targetWeight = step2.fitnessGoal.goal.targetWeight;
        } else if (step2?.fitnessGoal?.weightGoal?.targetWeight) {
          targetWeight = step2.fitnessGoal.weightGoal.targetWeight;
        }
        if (
          step2 &&
          (step2.fitnessGoal?.type === "lose_weight" ||
            step2.fitnessGoal?.type === "gain_weight")
        ) {
          setGoalData({
            ...step2.fitnessGoal.goal,
            type: step2.fitnessGoal.type,
            targetWeight,
          });
        } else {
          setGoalData(null);
        }
      } catch (e) {
        setGoalData(null);
      }
    };
    fetchGoalData();
  }, [userId, token]);

  // Helper: should show goal tracker
  const shouldShowGoalTracker =
    goalData &&
    (goalData.type === "lose_weight" || goalData.type === "gain_weight");

  return (
    <motion.div
      className="progress-page bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div variants={itemVariants} className="mb-6">
          <MotivationalQuote quote={quote.quote} author={quote.author} />
        </motion.div>

        <div className="flex flex-col gap-6 mb-6">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Your Streaks
            </h2>
            <StreakTracker
              dailyCompletedMeals={dailyCompletedMeals}
              dailyMaxMeals={dailyMaxMeals}
              dailyCompletedExercises={dailyCompletedExercises}
              dailyMaxExercises={dailyMaxExercises}
              dailyCompletedDays={dailyCompletedDays}
              weeklyCurrent={weeklyCurrent}
              weeklyMax={weeklyMax}
              monthlyCurrent={monthlyCurrent}
              monthlyMax={monthlyMax}
              totalTimeframeWeeks={totalTimeframeWeeks}
            />
            {streakLoading && <div>Loading streaks...</div>}
            {streakError && <div className="text-red-500">{streakError}</div>}
          </motion.div>

          {shouldShowGoalTracker && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Goal Tracker
              </h2>
              <GoalTracker
                startWeight={weightHistory[0]?.value ?? 0}
                currentWeight={currentWeight?.value ?? 0}
                targetWeight={goalData?.targetWeight ?? 0}
                startDate={startDate ?? new Date()}
                targetDate={targetDate ?? new Date()}
                adjustedTargetDate={adjustedTargetDate ?? new Date()}
                penaltyDaysCount={penaltyDaysCount}
              />
            </motion.div>
          )}
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          <AnthropometricMeasurements
            weightHistory={weightHistory}
            heightHistory={heightHistory}
            waistHistory={waistHistory}
            hipHistory={hipHistory}
            fatMassHistory={fatMassHistory}
            leanMassHistory={leanMassHistory}
            currentWeight={currentWeight}
            currentHeight={currentHeight}
            currentWaist={currentWaist}
            currentHip={currentHip}
            currentFatMass={currentFatMass}
            currentLeanMass={currentLeanMass}
            onSaveMeasurement={saveMeasurement}
          />
          {anthropoLoading && <div>Loading measurements...</div>}
          {anthropoError && <div className="text-red-500">{anthropoError}</div>}
        </motion.div>
        <motion.div variants={itemVariants} className="mb-6">
          <ProgressPhotos photos={photos} setPhotos={setPhotos} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Progress;
