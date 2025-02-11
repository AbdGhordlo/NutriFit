import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Wand2, Edit3 } from "lucide-react";
import { ClipLoader } from "react-spinners";
import "../assets/commonStyles.css";
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
        const response = await fetch(
          `http://localhost:5000/exercise-planner/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

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
      <div className="loading-container">
        <ClipLoader color="#7ec987" size={50} /> {/* Display the spinner */}
      </div>
    );
  }

  if (weeklyPlan.length === 0) {
    return <div>No exercise plan data found.</div>;
  }

  return (
    <div className="outer-container">
      <div className="main-container">
        <h1 className="title">Weekly Exercise Plan</h1>

        <div className={`day-container ${isToday(currentDay) ? "today" : ""}`}>
          <div className="day-header">
            <h2 className="day-name">Day {weeklyPlan[currentDay].day_number}</h2>
          </div>

          <div className="items-list">
            {weeklyPlan[currentDay].exercises.map((exercise) => (
              <div key={exercise.id} className="list-item">
                <div className="item-info">
                  <h3 className="item-name">{exercise.name}</h3>
                  <div className="item-time-info">
                    <span className="item-time">{exercise.time}</span>
                    <span className="dot">•</span>
                    <span className="item-time">
                      {exercise.calories_burned} kcal
                    </span>
                  </div>
                </div>

                <div className="details-container">
                  {exercise.has_reps_sets && (
                    <div className="detail-item">
                      <span className="detail-label">Reps:</span>
                      <span className="detail-value">{exercise.reps}</span>
                    </div>
                  )}
                  {exercise.has_reps_sets && (
                    <div className="detail-item">
                      <span className="detail-label">Sets:</span>
                      <span className="detail-value">{exercise.sets}</span>
                    </div>
                  )}
                  {exercise.has_duration && (
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{exercise.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="navigation-container">
          <button
            onClick={handlePrevDay}
            disabled={currentDay === 0}
            className={`nav-button ${currentDay === 0 ? "disabled" : ""}`}
          >
            <ChevronLeft className="nav-icon" />
          </button>

          <button
            onClick={handleNextDay}
            disabled={currentDay === 6}
            className={`nav-button ${currentDay === 6 ? "disabled" : ""}`}
          >
            <ChevronRight className="nav-icon" />
          </button>
        </div>
      </div>

      <div className="buttons-container">
        <button className="generate-button">
          <Wand2 className="button-icon" />
          <span>Generate Plan</span>
        </button>

        <button className="edit-button">
          <Edit3 className="button-icon" />
          <span>Edit Plan</span>
        </button>
      </div>
    </div>
  );
}