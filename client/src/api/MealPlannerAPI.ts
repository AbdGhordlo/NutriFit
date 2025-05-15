import { DayPlan, Meal } from "../types/mealPlannerTypes";

export const getAdoptedMealPlan = async (userId: number, token: string) => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/${userId}/adopted`, {
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
    console.log("data: ",data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const generateMealPlan = async (userId: number, token: string): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/${userId}/generate-meal-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};

export const saveMealPlan = async (userId: number, plan: any, token: string) => {
  try {
    const response = await fetch("http://localhost:5000/meal-planner/save-meal-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, plan }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving meal plan:", error);
    throw error;
  }
};

export const saveAndAdoptMealPlan = async (userId: number, plan: any, token: string) => {
  try {
    const response = await fetch("http://localhost:5000/meal-planner/save-and-adopt-meal-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, plan }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving and adopting meal plan:", error);
    throw error;
  }
};

export const adoptMealPlan = async (userId: number, mealPlanId: number, token: string) => {
  try {
    const response = await fetch("http://localhost:5000/meal-planner/adopt-meal-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, mealPlanId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adopting meal plan:", error);
    throw error;
  }
};

export const getAllMealPlansByUser = async (userId: number, token: string) => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/${userId}/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    throw error;
  }
};

// --------------------------------------- Edit Plan ---------------------------------------

// Favorite Meals Functions
export const getFavoriteMeals = async (userId: number, token: string): Promise<Meal[]> => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/favorites/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching favorite meals:", error);
    throw error;
  }
};

export const addFavoriteMeal = async (userId: number, mealId: number, token: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/favorites/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mealId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error adding meal to favorites:", error);
    throw error;
  }
};

export const removeFavoriteMeal = async (userId: number, mealId: number, token: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/favorites/${userId}/${mealId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error removing meal from favorites:", error);
    throw error;
  }
};

// Meal Plan Editing Functions
export const regenerateDay = async (userId: number, dayNumber: number, token: string): Promise<DayPlan> => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/regenerate-day/${userId}/${dayNumber}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error regenerating day:", error);
    throw error;
  }
};

export const regenerateMeal = async (userId: number, mealPlanMealId: number, token: string): Promise<Meal> => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/regenerate-meal/${userId}/${mealPlanMealId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error regenerating meal:", error);
    throw error;
  }
};

export const replaceMealWithFavorite = async (
  userId: number,
  mealPlanMealId: number,
  favoriteMealId: number,
  token: string
): Promise<Meal> => {
  try {
    const response = await fetch(`http://localhost:5000/meal-planner/replace-with-favorite/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mealPlanMealId, favoriteMealId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error replacing meal with favorite:", error);
    throw error;
  }
};