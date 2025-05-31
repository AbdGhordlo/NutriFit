export const getTodaysExercisesByUser = async (userId: number, token: string): Promise<any> => {
  try {
    const response = await fetch(
      `http://localhost:5000/exercise-planner/users/${userId}/exercises/today`,
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
      `http://localhost:5000/exercise-planner/${userId}/generate-exercise-plan`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token for authentication
        },
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
      "http://localhost:5000/exercise-planner/save-exercise-plan",
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
      "http://localhost:5000/exercise-planner/save-and-adopt-exercise-plan",
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
      "http://localhost:5000/exercise-planner/adopt-exercise-plan",
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
      `http://localhost:5000/exercise-planner/${userId}/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
