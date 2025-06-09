import { useState, useEffect, useCallback } from "react";
import * as homeService from "../../services/homeService";
import * as progressService from "../../services/progressService";
import * as personalizationService from "../../services/personalizationService";
import { getTodaysMealsByUser } from "../../api/MealPlannerAPI";
import { getTodaysExercisesByUser } from "../../api/ExercisePlannerAPI";

export interface StreakData {
  dailyCompletedMeals: number;
  dailyMaxMeals: number;
  dailyCompletedExercises: number;
  dailyMaxExercises: number;
  dailyCompletedDays: number;
  weeklyCurrent: number;
  weeklyMax: number;
  monthlyCurrent: number;
  monthlyMax: number;
  totalTimeframeWeeks: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStreakData(userId: number, token: string, today: string): StreakData {
  const [dailyCompletedMeals, setDailyCompletedMeals] = useState(0);
  const [dailyMaxMeals, setDailyMaxMeals] = useState(0);
  const [dailyCompletedExercises, setDailyCompletedExercises] = useState(0);
  const [dailyMaxExercises, setDailyMaxExercises] = useState(0);
  const [dailyCompletedDays, setDailyCompletedDays] = useState(0);
  const [weeklyCurrent, setWeeklyCurrent] = useState(0);
  const [weeklyMax, setWeeklyMax] = useState(1);
  const [monthlyCurrent, setMonthlyCurrent] = useState(0);
  const [monthlyMax, setMonthlyMax] = useState(0);
  const [totalTimeframeWeeks, setTotalTimeframeWeeks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreakData = useCallback(async () => {
    if (!userId || !token) return;
    setLoading(true);
    setError(null);
    try {
      // Meals
      const mealData = await getTodaysMealsByUser(userId, token);
      const completedMealIds = await homeService.fetchMealProgress(today, token);
      setDailyMaxMeals((mealData.meals || []).length);
      setDailyCompletedMeals(completedMealIds.length);

      // Exercises
      const exerciseData = await getTodaysExercisesByUser(userId, token);
      const completedExerciseIds = await homeService.fetchExerciseProgress(today, token);
      setDailyMaxExercises((exerciseData.exercises || []).length);
      setDailyCompletedExercises(completedExerciseIds.length);

      // Fetch completed_days_count from backend
      const { completed_days_count } = await progressService.fetchCompletedDaysCount(userId, token);
      setDailyCompletedDays(completed_days_count % 7);

      // Fetch personalization data for timeframe
      let weeklyMaxValue = 1;
      let monthlyMaxValue = 0;
      let timeframeWeeks = 0;
      try {
        const personalization = await personalizationService.fetchPersonalizationData(userId, token);
        const steps_data = personalization.steps_data || {};
        const fitnessGoal = steps_data.step_2?.fitnessGoal;
        const weightGoal = steps_data.step_2?.weightGoal;
        if (
          fitnessGoal &&
          ["lose_weight", "build_muscle", "body_recomposition"].includes(fitnessGoal.type)
        ) {
          weeklyMaxValue = weightGoal.timeframe;
          timeframeWeeks = weightGoal.timeframe;
          if (weightGoal.timeframe >= 4) {
            monthlyMaxValue = Math.floor(weightGoal.timeframe / 4);
          }
        } else {
          weeklyMaxValue = 4;
          monthlyMaxValue = 12;
          timeframeWeeks = 4;
        }
      } catch (e) {
        // fallback values already set
      }
      setWeeklyCurrent(Math.floor((completed_days_count / 7) % weeklyMaxValue));
      setWeeklyMax(weeklyMaxValue);
      setMonthlyCurrent(Math.floor(completed_days_count / 28));
      setMonthlyMax(monthlyMaxValue);
      setTotalTimeframeWeeks(timeframeWeeks);
    } catch (e: any) {
      setError(e.message || "Failed to fetch streak data");
    } finally {
      setLoading(false);
    }
  }, [userId, token, today]);

  useEffect(() => {
    fetchStreakData();
  }, [fetchStreakData]);

  return {
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
    loading,
    error,
    refetch: fetchStreakData,
  };
}
