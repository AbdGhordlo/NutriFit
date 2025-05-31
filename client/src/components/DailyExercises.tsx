import React from "react";
import { Clock, Dumbbell, Loader } from "lucide-react";
import { styles } from "./styles/DailyExercisesStyles";

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

interface DailyExercisesProps {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  currentDay: number;
  onToggle: (exercise: Exercise) => void;
}

const DailyExercises: React.FC<DailyExercisesProps> = ({
  exercises,
  loading,
  error,
  currentDay,
  onToggle,
}) => {
  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Today's Exercise Plan</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <Loader size={24} className="animate-spin" />
          <span style={{ marginLeft: "0.5rem" }}>Loading exercises...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Today's Exercise Plan</h2>
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Today's Exercise Plan</h2>
      <div style={styles.exercisesList}>
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            style={styles.exerciseItem(exercise.completed)}
          >
            <div style={styles.exerciseInfo}>
              <div style={styles.iconContainer(exercise.completed)}>
                <Dumbbell size={20} />
              </div>

              <div style={styles.exerciseDetails}>
                <h3 style={styles.exerciseName}>{exercise.name}</h3>
                <div style={styles.exerciseTime}>
                  <Clock size={16} />
                  <span>{exercise.time}</span>
                  {exercise.duration && (
                    <>
                      <span>•</span>
                      <span>{exercise.duration}</span>
                    </>
                  )}
                  {typeof exercise.calories_burned === "number" && (
                    <>
                      <span>•</span>
                      <span>{exercise.calories_burned} kcal</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={exercise.completed}
                onChange={() => onToggle(exercise)}
                style={styles.checkboxInput}
              />
              <div
                style={{
                  ...styles.customCheckbox,
                  ...(exercise.completed && styles.customCheckboxChecked),
                }}
              >
                <svg
                  style={{
                    ...styles.checkmark,
                    ...(exercise.completed && styles.checkmarkChecked),
                  }}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10L9 12L13 8"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      {exercises.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
          }}
        >
          No exercises planned for today. Consider adding some exercises to your
          plan!
        </div>
      )}
    </div>
  );
};

export default DailyExercises;
