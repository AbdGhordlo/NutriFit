import React, { useEffect, useState } from "react";
import { commonStyles } from "./styles/commonStyles";
import { ChevronLeft, ChevronRight, Wand2, Edit3 } from "lucide-react";
import { styles } from "./styles/ExercisePlannerStyles";
import { ClipLoader } from "react-spinners";
import "./styles/ExercisePlannerStyles.css";

interface Exercise {
  id: number;
  name: string;
  description: string;
  calories_burned: number;
  has_reps_sets: boolean;
  has_duration: boolean;
  reps?: number;
  sets?: number;
  duration?: number;
  time: string;
}

interface DayPlan {
  day_number: number;
  exercises: Exercise[];
}

export default function ExercisePlanner() {
  const [currentDay, setCurrentDay] = useState(0);
  const [navHover, setNavHover] = useState<string | null>(null);
  const [genHover, setGenHover] = useState(false);
  const [editHover, setEditHover] = useState(false);
  const [itemHover, setItemHover] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);

  useEffect(() => {
    const fetchExercisePlan = async () => {
      const userId = 1; // Replace with the logged-in user's ID
      const token = localStorage.getItem("token"); // Retrieve JWT from local storage

      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login"; // Redirect if no token is found
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/exercise-planner/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          console.error("Unauthorized, removing token and redirecting...");
          localStorage.removeItem("token"); // Remove expired/invalid token
          window.location.href = "/login"; // Redirect to login page
          return;
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data); // Log the API response

        // Group exercises by day
        const groupedData = data.reduce((acc: any, exercise: any) => {
          const day = exercise.day_number - 1; // Convert to 0-based index
          if (!acc[day]) {
            acc[day] = { day_number: exercise.day_number, exercises: [] };
          }
          acc[day].exercises.push({
            id: exercise.exercise_id,
            name: exercise.exercise_name,
            description: exercise.exercise_description,
            calories_burned: exercise.calories_burned,
            has_reps_sets: exercise.has_reps_sets,
            has_duration: exercise.has_duration,
            reps: exercise.reps,
            sets: exercise.sets,
            duration: exercise.duration,
            time: exercise.time,
          });
          return acc;
        }, []);

        setWeeklyPlan(groupedData);
      } catch (error) {
        console.error("Error fetching exercise plan:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchExercisePlan();
  }, []);

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color="#7ec987" size={50} /> {/* Display the spinner */}
      </div>
    );
  }

  if (weeklyPlan.length === 0) {
    return <div>No exercise plan data found.</div>;
  }

  return (
    <div style={commonStyles.container}>
      <div style={commonStyles.mainContainer}>
        <h1 style={commonStyles.title}>Weekly Exercise Plan</h1>

        <div style={commonStyles.dayContainer(isToday(currentDay))}>
          <div style={commonStyles.dayHeader}>
            <h2 style={commonStyles.dayName}>Day {weeklyPlan[currentDay].day_number}</h2>
          </div>

          <div style={commonStyles.itemsList}>
            {weeklyPlan[currentDay].exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="exercise-item"
                style={commonStyles.listItem}
              >
                <div style={commonStyles.itemInfo}>
                  <h3 style={commonStyles.itemName}>{exercise.name}</h3>
                  <div style={commonStyles.itemTimeInfo}>
                    <span style={commonStyles.itemTime}>{exercise.time}</span>
                    <span style={commonStyles.dot}>•</span>
                    <span style={commonStyles.itemTime}>{exercise.calories_burned} kcal</span>
                  </div>
                </div>

                <div style={styles.detailsContainer}>
                  {exercise.has_reps_sets && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Reps:</span>
                      <span style={styles.detailValue}>{exercise.reps}</span>
                    </div>
                  )}
                  {exercise.has_reps_sets && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Sets:</span>
                      <span style={styles.detailValue}>{exercise.sets}</span>
                    </div>
                  )}
                  {exercise.has_duration && (
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Duration:</span>
                      <span style={styles.detailValue}>{exercise.duration}</span>
                    </div>
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
              backgroundColor: navHover === "prev" ? "rgba(126, 201, 135, 0.1)" : "transparent",
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
              backgroundColor: navHover === "next" ? "rgba(126, 201, 135, 0.1)" : "transparent",
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
            backgroundColor: editHover ? "rgba(126, 201, 135, 0.1)" : "transparent",
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