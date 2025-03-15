export const generateMealPlan = async (): Promise<any> => {
  try {
    const response = await fetch("http://localhost:5000/meal-planner/generate-meal-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the JWT token for authentication
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the generated plan
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};