import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Wand2,
  Edit3,
  Bookmark,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import "../../assets/commonStyles.css";
import "../styles/ExercisePlannerStyles.css";
import {
  generateExercisePlan,
  saveExercisePlan,
  saveAndAdoptExercisePlan,
  adoptExercisePlan,
  getAllExercisePlansByUser,
} from "../../api/ExercisePlannerAI";
import { getUserIdFromToken } from "../../utils/auth";
import ErrorMessage from "../../components/ErrorMessage";
import {
  DayPlan,
  GeneratedExercisePlan,
} from "../../types/exercisePlannerTypes";
import SavedPlansPopup from "./SavedPlansPopup";
import GeneratedPlanPopup from "./GeneratedPlanPopup";

export default function ExercisePlanner() {
  const [currentDay, setCurrentDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [showGeneratePlanPopup, setShowGeneratePlanPopup] = useState(false);
  const [showSavedPlansPopup, setShowSavedPlansPopup] = useState(false);
  const [generatedPlan, setGeneratedPlan] =
    useState<GeneratedExercisePlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState("");
  const [savedPlans, setSavedPlans] = useState<any[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const id = getUserIdFromToken();
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchExercisePlan = async () => {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/exercise-planner/${userId}/adopted`,
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
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const groupedData = data.reduce((acc: any, exercise: any) => {
          const day = exercise.day_number - 1;
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
        setLoading(false);
      }
    };

    fetchExercisePlan();
  }, [userId]);

  const handleFetchSavedPlans = async () => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const data = await getAllExercisePlansByUser(Number(userId), token);
      setSavedPlans(data);
      setShowSavedPlansPopup(true);
    } catch (error) {
      console.error("Error fetching saved plans:", error);
    }
  };

  const handleAdoptPlan = async (exercisePlanId: number) => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const userId = Number(getUserIdFromToken()); // Ensure userId is a number
      if (isNaN(userId)) throw new Error("Invalid user ID");

      await adoptExercisePlan(userId, exercisePlanId, token);
      alert("Exercise plan adopted successfully!");
      window.location.reload(); // Reload to reflect the new adopted plan
    } catch (error) {
      console.error("Error adopting exercise plan:", error);
      alert("Failed to adopt exercise plan.");
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setShowGeneratePlanPopup(true);

    if (!token) {
      console.error("No token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }

    try {
      const plan = await generateExercisePlan(Number(userId), token); // Call the AI function
      setGeneratedPlan(plan);
    } catch (error) {
      console.error("Error generating exercise plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClosePopup = () => {
    setShowGeneratePlanPopup(false);
    setGeneratedPlan(null);
  };

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

  const handleSavePlan = async () => {
    if (!generatedPlan) return;

    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const userId = Number(getUserIdFromToken()); // Ensure userId is a number
      if (isNaN(userId)) throw new Error("Invalid user ID");

      await saveExercisePlan(userId, generatedPlan, token);
      alert("Exercise plan saved successfully!");
    } catch (error) {
      console.error("Error saving exercise plan:", error);
      alert("Failed to save exercise plan.");
    }
  };

  const handleSaveAndAdoptPlan = async () => {
    if (!generatedPlan) return;

    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const userId = Number(getUserIdFromToken()); // Ensure userId is a number
      if (isNaN(userId)) throw new Error("Invalid user ID");

      await saveAndAdoptExercisePlan(userId, generatedPlan, token);
      alert("Exercise plan saved and adopted successfully!");
      window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error("Error adopting exercise plan:", error);
      alert("Failed to adopt exercise plan.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#7ec987" size={50} /> {/* Display the spinner */}
      </div>
    );
  }

  if (weeklyPlan.length === 0) {
    return (
      <div className="no-plan-error-container">
        <ErrorMessage message={"No exercise plan data found."} />
      </div>
    );
  }

  return (
    <div className="outer-container">
      <div className="main-container">
        <h1 className="title">Weekly Exercise Plan</h1>

        <div className={`day-container ${isToday(currentDay) ? "today" : ""}`}>
          <div className="day-header">
            <h2 className="day-name">
              Day {weeklyPlan[currentDay].day_number}
            </h2>
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
        <button className="generate-button" onClick={handleGeneratePlan}>
          <Wand2 className="button-icon" />
          <span>Generate Plan</span>
        </button>

        <button className="edit-button">
          <Edit3 className="button-icon" />
          <span>Edit Plan</span>
        </button>

        <button className="saved-plans-button" onClick={handleFetchSavedPlans}>
          <Bookmark className="button-icon" />
          <span>Saved Plans</span>
        </button>
      </div>

      {showSavedPlansPopup && (
        <SavedPlansPopup
          savedPlans={savedPlans}
          handleAdoptPlan={handleAdoptPlan}
          closePopup={() => setShowSavedPlansPopup(false)}
        />
      )}

      {showGeneratePlanPopup && (
        <GeneratedPlanPopup
          generatedPlan={generatedPlan}
          isGenerating={isGenerating}
          handleSavePlan={handleSavePlan}
          handleSaveAndAdoptPlan={handleSaveAndAdoptPlan}
          handleClosePopup={handleClosePopup}
        />
      )}
    </div>
  );
}
