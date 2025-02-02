import React, { useState } from "react";
import { commonStyles } from "./styles/commonStyles";
import { ChevronLeft, ChevronRight, Wand2, Edit3 } from "lucide-react";
import { styles } from "./styles/ExercisePlannerStyles";

interface Exercise {
  id: number;
  name: string;
  time: string;
  duration: string;
  sets: number;
  reps: number;
  weight: number;
  type: "strength" | "cardio";
}

interface DayPlan {
  id: number;
  name: string;
  date: string;
  exercises: Exercise[];
}

const weeklyPlan: DayPlan[] = [
  {
    id: 0,
    name: "Sunday",
    date: "Mar 24",
    exercises: [
      {
        id: 1,
        name: "Bench Press",
        time: "09:00",
        duration: "20 min",
        sets: 4,
        reps: 12,
        weight: 135,
        type: "strength",
      },
      {
        id: 2,
        name: "Treadmill Run",
        time: "09:30",
        duration: "30 min",
        sets: 1,
        reps: 1,
        weight: 0,
        type: "cardio",
      },
      {
        id: 3,
        name: "Squats",
        time: "10:15",
        duration: "25 min",
        sets: 4,
        reps: 10,
        weight: 185,
        type: "strength",
      },
      {
        id: 4,
        name: "Pull-ups",
        time: "10:45",
        duration: "15 min",
        sets: 3,
        reps: 8,
        weight: 0,
        type: "strength",
      },
    ],
  },
  {
    id: 1,
    name: "Monday",
    date: "Mar 25",
    exercises: [
      {
        id: 1,
        name: "Deadlift",
        time: "08:00",
        duration: "25 min",
        sets: 4,
        reps: 8,
        weight: 225,
        type: "strength",
      },
      {
        id: 2,
        name: "Rowing",
        time: "08:30",
        duration: "20 min",
        sets: 1,
        reps: 1,
        weight: 0,
        type: "cardio",
      },
      {
        id: 3,
        name: "Shoulder Press",
        time: "09:00",
        duration: "20 min",
        sets: 4,
        reps: 12,
        weight: 95,
        type: "strength",
      },
      {
        id: 4,
        name: "Cycling",
        time: "09:30",
        duration: "30 min",
        sets: 1,
        reps: 1,
        weight: 0,
        type: "cardio",
      },
    ],
  },
];

export default function ExercisePlanner() {
  const [currentDay, setCurrentDay] = useState(0);
  const [navHover, setNavHover] = useState<string | null>(null);
  const [genHover, setGenHover] = useState(false);
  const [editHover, setEditHover] = useState(false);
  const [itemHover, setItemHover] = useState<number | null>(null);

  const handlePrevDay = () => {
    if (currentDay > 0) {
      setCurrentDay(currentDay - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDay < 6) {
      setCurrentDay(currentDay + 1);
    }
  };

  const isToday = (day: number) => {
    const date = new Date();
    return day === date.getDay() ? true : false;
  };

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.mainContainer}>
        <h1 style={commonStyles.title}>Weekly Exercise Plan</h1>

        <div style={commonStyles.dayContainer(isToday(currentDay))}>
          <div style={commonStyles.dayHeader}>
            <h2 style={commonStyles.dayName}>{weeklyPlan[currentDay].name}</h2>
            <span style={commonStyles.dayDate}>{weeklyPlan[currentDay].date}</span>
          </div>

          <div style={commonStyles.itemsList}>
            {weeklyPlan[currentDay].exercises.map((exercise) => (
              <div
                key={exercise.id}
                style={{
                  ...commonStyles.listItem,
                  border:
                    itemHover === exercise.id
                      ? "1px solid rgba(126, 201, 135)"
                      : "1px solid #f3f4f6",
                }}
                onMouseEnter={() => setItemHover(exercise.id)}
                onMouseLeave={() => setItemHover(null)}
              >
                <div style={commonStyles.itemInfo}>
                  <h3 style={commonStyles.itemName}>{exercise.name}</h3>
                  <div style={commonStyles.itemTimeInfo}>
                    <span style={commonStyles.itemTime}>{exercise.time}</span>
                    <span style={commonStyles.dot}>•</span>
                    <span style={commonStyles.itemTime}>{exercise.duration}</span>
                  </div>
                </div>

                <div style={styles.detailsContainer}>
                  {exercise.type === "strength" ? (
                    <>
                      <div style={styles.detailItem}>
                        <span style={styles.detailValue}>{exercise.sets}</span>
                        <span style={styles.detailLabel}>Sets</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailValue}>{exercise.reps}</span>
                        <span style={styles.detailLabel}>Reps</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailValue}>
                          {exercise.weight}
                        </span>
                        <span style={styles.detailLabel}>lbs</span>
                      </div>
                    </>
                  ) : (
                    <div style={styles.cardioLabel}>Cardio</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={commonStyles.navigationContainer}>
          <button
            onClick={handlePrevDay}
            disabled={currentDay === 0}
            style={{
              ...commonStyles.navButton(currentDay === 0),
              backgroundColor:
                navHover === "prev"
                  ? "rgba(126, 201, 135, 0.1)"
                  : "transparent",
            }}
            onMouseEnter={() => setNavHover("prev")}
            onMouseLeave={() => setNavHover(null)}
          >
            <ChevronLeft
              style={{
                width: 24,
                height: 24,
                color: currentDay === 0 ? "#d1d5db" : "#7ec987",
              }}
            />
          </button>

          <button
            onClick={handleNextDay}
            disabled={currentDay === 6}
            style={{
              ...commonStyles.navButton(currentDay === 6),
              backgroundColor:
                navHover === "next"
                  ? "rgba(126, 201, 135, 0.1)"
                  : "transparent",
            }}
            onMouseEnter={() => setNavHover("next")}
            onMouseLeave={() => setNavHover(null)}
          >
            <ChevronRight
              style={{
                width: 24,
                height: 24,
                color: currentDay === 6 ? "#d1d5db" : "#7ec987",
              }}
            />
          </button>
        </div>
      </div>

      <div style={commonStyles.buttonsContainer}>
        <button
          style={{
            ...commonStyles.generateButton,
            backgroundColor: genHover ? "#6db776" : "#7ec987",
          }}
          onMouseEnter={() => setGenHover(true)}
          onMouseLeave={() => setGenHover(false)}
        >
          <Wand2 style={{ width: 20, height: 20 }} />
          <span>Generate Plan</span>
        </button>

        <button
          style={{
            ...commonStyles.editButton,
            backgroundColor: editHover
              ? "rgba(126, 201, 135, 0.1)"
              : "transparent",
          }}
          onMouseEnter={() => setEditHover(true)}
          onMouseLeave={() => setEditHover(false)}
        >
          <Edit3 style={{ width: 20, height: 20 }} />
          <span>Edit Plan</span>
        </button>
      </div>
    </div>
  );
}
