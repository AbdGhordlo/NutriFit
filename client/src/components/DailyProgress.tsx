import React from "react";
import { Check } from "lucide-react";
import { styles } from "./styles/DailyProgressStyles";

interface Milestone {
  id: number;
  type: "meal" | "exercise";
  name: string;
  completed: boolean;
  time: string;
}

interface Meal {
  id: number;
  name: string;
  time: string;
  completed: boolean;
}

interface Exercise {
  id: number;
  name: string;
  time: string;
  completed: boolean;
}

interface DailyProgressProps {
  meals: Meal[];
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  currentDay: number;
}

const DailyProgress: React.FC<DailyProgressProps> = ({
  meals,
  exercises,
  loading,
  error,
}) => {
  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 12) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Merge meals and exercises into milestones, sorted by time
  const milestones: Milestone[] = [
    ...meals.map((meal) => ({
      id: meal.id,
      type: "meal" as const,
      name: meal.name,
      completed: meal.completed,
      time: meal.time,
    })),
    ...exercises.map((ex) => ({
      id: ex.id,
      type: "exercise" as const,
      name: ex.name,
      completed: ex.completed,
      time: ex.time,
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Today's Progress</h2>
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Today's Progress</h2>
        <div
          style={{
            color: "#ef4444",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  const completedCount = milestones.filter((m) => m.completed).length;
  const progress =
    milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Today's Progress</h2>
        <span style={styles.progressText}>
          {completedCount}/{milestones.length} completed
        </span>
      </div>
      <div>
        <div style={styles.progressBarContainer}>
          <div style={styles.progressBar(progress)} />
        </div>
        <div style={styles.milestonesContainer}>
          {milestones.map((milestone) => (
            <div
              key={milestone.type + "-" + milestone.id}
              style={styles.milestone as React.CSSProperties}
              title={milestone.name} // Show full text on hover
            >
              <div style={styles.milestoneIcon(milestone.completed)}>
                {milestone.completed && <Check size={16} />}
              </div>
              <span style={styles.milestoneTime}>{milestone.time}</span>
              <span style={styles.milestoneLabel as React.CSSProperties}>
                {milestone.type === "meal" ? "🍽️" : "💪"}{" "}
                {truncateText(milestone.name)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyProgress;
