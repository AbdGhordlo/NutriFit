import React, { useEffect, useState, useCallback } from "react";
import DailyProgress from "../components/DailyProgress";
import DailyMeals from "../components/DailyMeals";
import DailyExercises from "../components/DailyExercises";
import { styles } from "./styles/HomeStyles";
import "../assets/commonStyles.css";
import { getUserIdFromToken } from "../utils/auth";
import { useAuth } from "../utils/useAuth";
import { getTodaysMealsByUser } from "../api/MealPlannerAPI";
import { getTodaysExercisesByUser } from "../api/ExercisePlannerAPI";
import * as homeService from "../services/homeService";

interface Meal {
  id: number;
  mealId: number;
  name: string;
  time: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  description?: string;
  completed: boolean;
}

interface Exercise {
  id: number;
  exerciseId?: number;
  name: string;
  time: string;
  duration?: string;
  calories_burned?: number;
  completed: boolean;
  reps?: number;
  sets?: number;
}

function Home() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(1);

  const userId = getUserIdFromToken();
  const { getAuthToken } = useAuth();
  const token = getAuthToken()!;
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!userId || !token) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        // Fetch meals
        const mealData = await getTodaysMealsByUser(userId, token);
        setCurrentDay(mealData.currentDay || 1);
        const completedMealIds = await homeService.fetchMealProgress(
          today,
          token
        );
        const mealsWithCompletion = (mealData.meals || []).map(
          (meal: Meal) => ({
            ...meal,
            completed: completedMealIds.includes(meal.id),
          })
        );
        setMeals(mealsWithCompletion);

        // Fetch exercises
        const exerciseData = await getTodaysExercisesByUser(userId, token);
        const completedExerciseIds = await homeService.fetchExerciseProgress(
          today,
          token
        );
        const exercisesWithCompletion = (exerciseData.exercises || []).map(
          (exercise: Exercise) => ({
            ...exercise,
            completed: completedExerciseIds.includes(exercise.id),
          })
        );
        setExercises(exercisesWithCompletion);
      } catch (err: any) {
        setError(err.message || "Failed to fetch today's data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [today, token]);

  const toggleMeal = async (meal: Meal) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === meal.id ? { ...m, completed: !m.completed } : m
      )
    );
    try {
      await homeService.upsertMealProgress(
        meal.id,
        today,
        !meal.completed,
        token
      );
    } catch (e) {
      // Optionally handle error
    }
  };

  const toggleExercise = async (exercise: Exercise) => {
    setExercises((prev) =>
      prev.map((e) =>
        e.id === exercise.id ? { ...e, completed: !e.completed } : e
      )
    );
    try {
      await homeService.upsertExerciseProgress(
        exercise.id,
        today,
        !exercise.completed,
        token
      );
    } catch (e) {
      // Optionally handle error
    }
  };

  return (
    <div className="outer-container">
      <DailyProgress
        meals={meals}
        exercises={exercises}
        loading={loading}
        error={error}
        currentDay={currentDay}
      />
      <div style={styles.gridContainer}>
        <DailyMeals
          meals={meals}
          loading={loading}
          error={error}
          currentDay={currentDay}
          onToggle={toggleMeal}
        />
        <DailyExercises
          exercises={exercises}
          loading={loading}
          error={error}
          currentDay={currentDay}
          onToggle={toggleExercise}
        />
      </div>
    </div>
  );
}

export default Home;
