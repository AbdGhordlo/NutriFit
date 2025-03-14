export const generateExercisePlan = async (): Promise<any> => {
    try {
      const response = await fetch("http://localhost:5000/exercise-planner/generate-exercise-plan", {
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
      console.error("Error generating exercise plan:", error);
      throw error;
    }
  };