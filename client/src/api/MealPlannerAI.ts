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