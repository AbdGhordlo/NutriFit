import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MotivationalQuote from "../components/ProgressComponents/MotivationalQuote";
import StreakTracker from "../components/ProgressComponents/StreakTracker";
import AnthropometricMeasurements from "../components/ProgressComponents/AnthropometricMeasurements";
import GoalTracker from "../components/ProgressComponents/GoalTracker";
import ProgressPhotos from "../components/ProgressComponents/ProgressPhotos";
import { getUserIdFromToken } from "../utils/auth";
import { getTodaysMealsByUser } from "../api/MealPlannerAPI";
import { getTodaysExercisesByUser } from "../api/ExercisePlannerAPI";
import * as homeService from "../services/homeService";
import { useAuth } from "../utils/useAuth";

const Progress = () => {
  const [quote, setQuote] = useState({ quote: "", author: "" });
  const [photos, setPhotos] = useState([]);
  // Streak state
  const [dailyCompletedMeals, setDailyCompletedMeals] = useState(0);
  const [dailyMaxMeals, setDailyMaxMeals] = useState(0);
  const [dailyCompletedExercises, setDailyCompletedExercises] = useState(0);
  const [dailyMaxExercises, setDailyMaxExercises] = useState(0);
  const [dailyCompletedDays, setDailyCompletedDays] = useState(0);
  const [weeklyCurrent, setWeeklyCurrent] = useState(0);
  const [weeklyMax, setWeeklyMax] = useState(4); // Example: 4 weeks in a month
  const [monthlyCurrent, setMonthlyCurrent] = useState(0);
  const [monthlyMax, setMonthlyMax] = useState(12); // Example: 12 months in a year

  const userId = getUserIdFromToken();
  const { getAuthToken } = useAuth();
  const token = getAuthToken();
  const today = new Date().toISOString().slice(0, 10);

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
    // Fetch today's meals and exercises and compute streaks
    const fetchStreakData = async () => {
      if (!userId || !token) return;
      try {
        // Meals
        const mealData = await getTodaysMealsByUser(userId, token);
        const completedMealIds = await homeService.fetchMealProgress(
          today,
          token
        );
        console.log("mealData: ", completedMealIds.length);
        setDailyMaxMeals((mealData.meals || []).length);
        setDailyCompletedMeals(completedMealIds.length);

        // Exercises
        const exerciseData = await getTodaysExercisesByUser(userId, token);
        const completedExerciseIds = await homeService.fetchExerciseProgress(
          today,
          token
        );
        setDailyMaxExercises((exerciseData.exercises || []).length);
        setDailyCompletedExercises(completedExerciseIds.length);

        // For demo: set dailyCompletedDays, weeklyCurrent, monthlyCurrent
        // In a real app, fetch these from backend or compute from progress logs
        // Here, we just use the number of days this week with all meals+exercises completed
        // and similar for weeks/months
        // For now, set to 0 or mock values
        setDailyCompletedDays(2); // TODO: Replace with real calculation
        setWeeklyCurrent(2); // TODO: Replace with real calculation
        setMonthlyCurrent(1); // TODO: Replace with real calculation
      } catch (e) {
        // Optionally handle error
      }
    };
    fetchStreakData();
    // eslint-disable-next-line
  }, [today, token]);

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
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Goal Tracker
            </h2>
            {/* <GoalTracker goalData={goalData} /> */}
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md p-6 mb-6"
        >
          {/* <AnthropometricMeasurements historicalData={historicalData} /> */}
        </motion.div>
        <motion.div variants={itemVariants} className="mb-6">
          <ProgressPhotos photos={photos} setPhotos={setPhotos} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Progress;
