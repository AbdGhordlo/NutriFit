const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { Exercise } from "../types/exercisePlannerTypes";

export const getAdoptedExercisePlan = async (userId: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise-planner/adopted/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // console.log("data: ",data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTodaysExercisesByUser = async (userId: number, token: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exercise-planner/users/${userId}/exercises/today`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching today's exercises:", error);
    throw error;
  }
};

export const generateExercisePlan = async (userId: number, token: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exercise-planner/generate-exercise-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token for authentication
        },
        body: JSON.stringify({ userId })
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the generated plan
  } catch (error) {
    console.error("Error generating exercise plan:", error);
    throw error;
  }
};

export const saveExercisePlan = async (
  userId: number,
  plan: any,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exercise-planner/save-exercise-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, plan }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving exercise plan:", error);
    throw error;
  }
};

export const saveAndAdoptExercisePlan = async (
  userId: number,
  plan: any,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exercise-planner/save-and-adopt-exercise-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, plan }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving and adopting exercise plan:", error);
    throw error;
  }
};

export const adoptExercisePlan = async (
  userId: number,
  exercisePlanId: number,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exercise-planner/adopt-exercise-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, exercisePlanId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adopting exercise plan:", error);
    throw error;
  }
};

export const getAllExercisePlansByUser = async (
  userId: number,
  token: string
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/exercise-planner/all/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching exercise plans:", error);
    throw error;
  }
};

export const removeSavedPlan = async (userId: number, planId: number, token: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise-planner/remove-exercise-plan`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, planId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing meal plan:", error);
    throw error;
  }
};

// ------------------------------------------- Edit Plan functions ------------------------------------

export const getFavoriteExercises = async (userId: number, token: string): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise-planner/favorites/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching favorite exercises:", error);
    throw error;
  }
};

export const addFavoriteExercise = async (
  userId: number, 
  exerciseId: number, 
  token: string,
  reps?: number,
  sets?: number,
  duration?: string,
): Promise<Exercise> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise-planner/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        userId, 
        exerciseId,
        reps,
        sets,
        duration,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding exercise to favorites:", error);
    throw error;
  }
};

export const regenerateExerciseDay = async (userId: number, dayNumber: number, token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise-planner/regenerate-day`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, dayNumber }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error regenerating exercise day:", error);
    throw error;
  }
};

export const regenerateSingleExercise = async (userId: number, exercisePlanExerciseId: number, token: string): Promise<Exercise> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise-planner/regenerate-exercise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, exercisePlanExerciseId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error regenerating exercise:", error);
    throw error;
  }
};

export const replaceWithFavoriteExercise = async (
  userId: number,
  exercisePlanExerciseId: number,
  favoriteExerciseId: number,
  token: string
): Promise<{
  message: string;
  newExercise: Exercise & {
    reps?: number;
    sets?: number;
    duration?: string;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise-planner/replace-with-favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, exercisePlanExerciseId, favoriteExerciseId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error replacing exercise with favorite:", error);
    throw error;
  }
};


export const removeFavoriteExercise = async (userId: number, exerciseId: number, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exercise-planner/favorites`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, exerciseId }),
    });
console.log("meal id to remove: ", exerciseId);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove favorite exercise");
    }
  } catch (error) {
    console.error("Error removing favorite exercise:", error);
    throw error;
  }
};