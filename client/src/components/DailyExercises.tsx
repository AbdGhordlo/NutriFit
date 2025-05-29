// client/src/components/DailyExercises.tsx
import React, { useState, useEffect } from "react";
import { Clock, Dumbbell } from "lucide-react";
import { styles } from "./styles/DailyExercisesStyles";
import { useAuth } from "../utils/useAuth";

import * as homeService from "../services/homeService";

interface Exercise {
  id: number;
  name: string;
  time: string;
  duration: string;
  calories: number;
  completed: boolean;
}

export default function DailyExercises() {
  const { getAuthToken } = useAuth();
  const token = getAuthToken()!;
  const today = new Date().toISOString().slice(0, 10);

  const [exercises, setExercises] = useState<Exercise[]>([
    { id: 1, name: "Morning Cardio",    time: "09:30", duration: "30 min", calories: 300, completed: true },
    { id: 2, name: "Upper Body Strength",time: "17:00", duration: "45 min", calories: 250, completed: false },
  ]);

  // On mount: fetch saved exercise progress
  useEffect(() => {
    (async () => {
      try {
        const rows = await homeService.fetchExerciseProgress(today, token);
        setExercises(ex =>
          ex.map(e => ({
            ...e,
            completed: !!rows.find(r => r.exercise_id === e.id)?.completed
          }))
        );
      } catch (e) {
        console.error("Fetch exercise progress failed", e);
      }
    })();
  }, [today, token]);

  const toggle = async (ex: Exercise) => {
    const updated = exercises.map(e =>
      e.id === ex.id ? { ...e, completed: !e.completed } : e
    );
    setExercises(updated);

    try {
      await homeService.upsertExerciseProgress(
        ex.id,
        today,
        !ex.completed,
        token
      );
    } catch (e) {
      console.error("Save exercise progress failed", e);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Today's Exercise Plan</h2>
      <div style={styles.exercisesList}>
        {exercises.map(ex => (
          <div key={ex.id} style={styles.exerciseItem(ex.completed)}>
            <div style={styles.exerciseInfo}>
              <div style={styles.iconContainer(ex.completed)}>
                <Dumbbell size={20} />
              </div>
              <div style={styles.exerciseDetails}>
                <h3 style={styles.exerciseName}>{ex.name}</h3>
                <div style={styles.exerciseTime}>
                  <Clock size={16} />
                  <span>{ex.time}</span>
                  <span>•</span>
                  <span>{ex.duration}</span>
                  <span>•</span>
                  <span>{ex.calories} kcal</span>
                </div>
              </div>
            </div>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={ex.completed}
                onChange={() => toggle(ex)}
                style={styles.checkboxInput}
              />
              <div
                style={{
                  ...styles.customCheckbox,
                  ...(ex.completed && styles.customCheckboxChecked),
                }}
              >
                <svg
                  style={{
                    ...styles.checkmark,
                    ...(ex.completed && styles.checkmarkChecked),
                  }}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 10L9 12L13 8" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
