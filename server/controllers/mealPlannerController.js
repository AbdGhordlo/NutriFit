const pool = require('../db');

const getMealPlanByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        mp.id AS meal_plan_id,
        mp.name AS meal_plan_name,
        mp.description AS meal_plan_description,
        mpm.day_number,
        mpm.meal_order,
        m.id AS meal_id,
        m.name AS meal_name,
        m.description AS meal_description,
        m.calories,
        m.protein,
        m.carbs,
        m.fats,
        mpm.id AS meal_plan_meal_id,
        TO_CHAR(mpm.time, 'HH24:MI') AS time -- Format time to remove seconds
      FROM meal_plan mp
      JOIN meal_plan_meal mpm ON mp.id = mpm.meal_plan_id
      JOIN meal m ON mpm.meal_id = m.id
      WHERE mp.user_id = $1
      ORDER BY mpm.day_number, mpm.meal_order`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getMealPlan = async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "x",
        "X-Title": "x",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "user",
            content: `Generate a 7-day meal plan in valid JSON format. The plan should include meals for breakfast, lunch, and dinner each day. Each meal should have a name, description, calories, protein, carbs, fats, and time. The JSON structure should match this format:
            {
              "meal_plan": {
                "name": "7-Day Meal Plan",
                "description": "A balanced meal plan for a week."
              },
              "meals": [
                {
                  "name": "Meal Name",
                  "description": "Meal Description",
                  "calories": 500,
                  "protein": 30,
                  "carbs": 50,
                  "fats": 20,
                  "time": "08:00",
                  "day_number": 1
                }
              ]
            }
            Make sure the response is valid JSON and does not include any additional text or explanations.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("AI Response:", data.choices[0].message.content); // Log the response for debugging

    // Extract JSON from the response using a regular expression
    const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    // Parse the extracted JSON
    let generatedPlan;
    try {
      generatedPlan = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      throw new Error("AI response is not valid JSON");
    }

    res.status(200).json(generatedPlan); // Send the generated plan back to the frontend
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res.status(500).json({ error: "Failed to generate meal plan" });
  }
};

module.exports = { getMealPlanByUser, getMealPlan };
