import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Wand2,
  Edit3,
  Bookmark,
  Heart,
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
  removeSavedPlan,
  getFavoriteExercises,
  regenerateExerciseDay,
  regenerateSingleExercise,
  addFavoriteExercise,
  removeFavoriteExercise,
  replaceWithFavoriteExercise,
  getAdoptedExercisePlan,
} from "../../api/ExercisePlannerAPI";
import { getUserIdFromToken } from "../../utils/auth";
import ErrorMessage from "../../components/ErrorMessage";
import {
  DayPlan,
  Exercise,
  GeneratedExercisePlan,
} from "../../types/exercisePlannerTypes";
import SavedPlansPopup from "./SavedPlansPopup";
import GeneratedPlanPopup from "./GeneratedPlanPopup";
import { EditExercisePopup } from "./EditExercisePlanPopup";
import FavoriteExercisesPopup from "./FavoriteExercisesPopup";

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
  const [showEditExercisePopup, setShowEditExercisePopup] = useState(false);
  const [favoriteExercises, setFavoriteExercises] = useState<Exercise[]>([]);
  const [showFavoriteExercisesPopup, setShowFavoriteExercisesPopup] =
    useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const id = getUserIdFromToken();
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetchExercisePlan();
  }, [userId]);

  const fetchExercisePlan = async () => {
    if (!token) {
      console.error("No token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }
    try {
      const data = await getAdoptedExercisePlan(Number(userId), token);

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
          exercise_plan_exercise_id: exercise.exercise_plan_exercise_id,
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

  const handleRemoveSavedPlan = async (planId: number) => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      if (window.confirm("Are you sure you want to delete this meal plan?")) {
        await removeSavedPlan(Number(userId), planId, token);

        // Refresh the saved plans list
        const updatedPlans = await getAllExercisePlansByUser(
          Number(userId),
          token
        );
        setSavedPlans(updatedPlans);

        alert("Meal plan removed successfully!");
      }
    } catch (error) {
      console.error("Error removing meal plan:", error);
      alert(error.message || "Failed to remove meal plan");
    }
  };

  const handleRegeneratePlan = async () => {
    setIsGenerating(true);

    if (!token) {
      console.error("No token found, redirecting to login...");
      window.location.href = "/login";
      return;
    }

    try {
      const plan = await generateExercisePlan(Number(userId), token);
      setGeneratedPlan(plan);
    } catch (error) {
      console.error("Error regenerating exercise plan:", error);
    } finally {
      setIsGenerating(false);
    }
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

  // ------------------------------------------- Edit Plan functions ------------------------------------
  const fetchFavoriteExercises = async () => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      const data = await getFavoriteExercises(Number(userId), token);
      setFavoriteExercises(data);
      console.log("fav exercises: ", data);
    } catch (error) {
      console.error("Error fetching favorite exercises:", error);
    }
  };

  const handleAddToFavorites = async (exercise: Exercise) => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      console.log("adding exercise: ", exercise);
      await addFavoriteExercise(
        Number(userId),
        exercise.id,
        token,
        exercise.reps,
        exercise.sets,
        exercise.duration
      );

      // Refresh favorites list
      const updatedFavorites = await getFavoriteExercises(
        Number(userId),
        token
      );
      setFavoriteExercises(updatedFavorites);

      alert("Exercise added to favorites!");
    } catch (error) {
      console.error("Error adding exercise to favorites:", error);
      alert("Failed to add exercise to favorites");
    }
  };

  const handleRegenerateDay = async (dayNumber: number) => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      const data = await regenerateExerciseDay(
        Number(userId),
        dayNumber,
        token
      );
      fetchExercisePlan();

      alert("Day regenerated successfully!");
    } catch (error) {
      console.error("Error regenerating day:", error);
      alert("Failed to regenerate day");
    }
  };

  const handleRegenerateExercise = async (exercisePlanExerciseId: number) => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      const data = await regenerateSingleExercise(
        Number(userId),
        exercisePlanExerciseId,
        token
      );
      fetchExercisePlan();

      alert("Exercise regenerated successfully!");
    } catch (error) {
      console.error("Error regenerating exercise:", error);
      alert("Failed to regenerate exercise");
    }
  };

  const handleRemoveExerciseFromFavorites = async (exerciseId: number) => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      await removeFavoriteExercise(Number(userId), exerciseId, token);

      // Refresh favorites list
      const updatedFavorites = await getFavoriteExercises(
        Number(userId),
        token
      );
      setFavoriteExercises(updatedFavorites);

      alert("Exercise removed from favorites!");
    } catch (error) {
      console.error("Error removing exercise from favorites:", error);
      alert("Failed to remove exercise from favorites");
    }
  };

  const handleReplaceWithFavorite = async (
    exercisePlanExerciseId: number,
    favoriteExercise: Exercise & {
      reps?: number;
      sets?: number;
      duration?: string;
    }
  ) => {
    try {
      if (!token) {
        console.error("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }
      console.log(
        "exercise to replace: ",
        userId,
        exercisePlanExerciseId,
        favoriteExercise
      );
      const response = await replaceWithFavoriteExercise(
        Number(userId),
        exercisePlanExerciseId,
        favoriteExercise.exercise_id,
        token
      );

      await fetchExercisePlan();

      alert(`Exercise replaced with ${favoriteExercise.name} successfully!`);
      console.log("New exercise details:", response.newExercise);
    } catch (error) {
      console.error("Error replacing exercise with favorite:", error);
      alert("Failed to replace exercise with favorite");
    }
  };

  // -------------------------------------------------------------------------------

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
              <div
                key={exercise.exercise_plan_exercise_id}
                className="list-item"
              >
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

        <button
          className="edit-button"
          onClick={() => {
            setShowEditExercisePopup(true);
            fetchFavoriteExercises();
          }}
        >
          <Edit3 className="button-icon" />
          <span>Edit Plan</span>
        </button>

        <button className="saved-plans-button" onClick={handleFetchSavedPlans}>
          <Bookmark className="button-icon" />
          <span>Saved Plans</span>
        </button>

        <button
          className="favorite-list-button"
          onClick={() => {
            setShowFavoriteExercisesPopup(true);
            fetchFavoriteExercises();
          }}
        >
          <Heart className="button-icon" />
          <span>Favorite Exercises</span>
        </button>
      </div>

      {showSavedPlansPopup && (
        <SavedPlansPopup
          savedPlans={savedPlans}
          handleAdoptPlan={handleAdoptPlan}
          closePopup={() => setShowSavedPlansPopup(false)}
          handleRemovePlan={handleRemoveSavedPlan}
        />
      )}

      {showGeneratePlanPopup && (
        <GeneratedPlanPopup
          generatedPlan={generatedPlan}
          isGenerating={isGenerating}
          handleSavePlan={handleSavePlan}
          handleSaveAndAdoptPlan={handleSaveAndAdoptPlan}
          handleRegeneratePlan={handleRegeneratePlan}
          handleClosePopup={handleClosePopup}
        />
      )}

      {showEditExercisePopup && (
        <EditExercisePopup
          weeklyPlan={weeklyPlan}
          currentDay={currentDay}
          onRegenerateDay={handleRegenerateDay}
          onRegenerateExercise={handleRegenerateExercise}
          onAddToFavorites={handleAddToFavorites}
          onReplaceWithFavorite={handleReplaceWithFavorite}
          onClose={() => setShowEditExercisePopup(false)}
          favoriteExercises={favoriteExercises}
        />
      )}

      {showFavoriteExercisesPopup && (
        <FavoriteExercisesPopup
          favoriteExercises={favoriteExercises}
          onRemoveFavorite={handleRemoveExerciseFromFavorites}
          closePopup={() => setShowFavoriteExercisesPopup(false)}
        />
      )}
    </div>
  );
}
