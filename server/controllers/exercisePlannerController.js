const pool = require('../db');
const Groq = require("groq-sdk");
const groq = new Groq(process.env.GROQ_API_KEY);

const getExercisePlanByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        ep.id AS exercise_plan_id,
        ep.name AS exercise_plan_name,
        ep.description AS exercise_plan_description,
        epe.day_number,
        epe.exercise_order,
        TO_CHAR(epe.time, 'HH24:MI') AS time, -- Format time for consistency
        epe.reps,
        epe.sets,
        epe.duration,
        e.id AS exercise_id,
        e.name AS exercise_name,
        e.description AS exercise_description,
        e.calories_burned,
        e.has_reps_sets,
        e.has_duration
      FROM exercise_plan ep
      JOIN exercise_plan_exercise epe ON ep.id = epe.exercise_plan_id
      JOIN exercise e ON epe.exercise_id = e.id
      WHERE ep.user_id = $1
      ORDER BY epe.day_number, epe.exercise_order`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const generateExercisePlan = async (req, res) => {
  try {
    // Define the system prompt to guide the AI
    const SYSTEM_PROMPT = `You are a helpful fitness trainer. Generate a 7-day exercise plan in valid JSON format. The plan can include multiple exercises for each day. Each exercise should have a name, description, calories burned, whether it has reps/sets, whether it has duration, and time. The JSON structure should match this format:
    {
      "exercise_plan": {
        "name": "7-Day Exercise Plan",
        "description": "A balanced exercise plan for a week."
      },
      "exercises": [
        {
          "name": "Exercise Name",
          "description": "Exercise Description",
          "calories_burned": 100,
          "has_reps_sets": true,
          "has_duration": false,
          "reps": 10,
          "sets": 3,
          "time": "08:00",
          "day_number": 1
        },
        {
          "name": "Exercise Name",
          "description": "Exercise Description",
          "calories_burned": 100,
          "has_reps_sets": false,
          "has_duration": true,
          "duration": 30,
          "time": "12:00",
          "day_number": 1
        },
        {
          "name": "Exercise Name",
          "description": "Exercise Description",
          "calories_burned": 100,
          "has_reps_sets": true,
          "has_duration": false,
          "reps": 10,
          "sets": 3,
          "time": "18:00",
          "day_number": 1
        }
      ]
    }
    Make sure the response is valid JSON and does not include any additional text or explanations. Include multiple exercises for each day, covering different types of workouts (e.g., strength, cardio, flexibility).`;

    // Make the request to Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT }, // System prompt to guide the AI
        { role: "user", content: "Generate a 7-day exercise plan in JSON format." }, // User prompt
      ],
      model: "deepseek-r1-distill-llama-70b", // Use the desired model
      temperature: 0.6, // Adjust for creativity
      max_tokens: 4096, // Adjust based on your needs
      top_p: 0.95, // Adjust for diversity
      stream: false, // Disable streaming for a single response
    });

    // Log the response for debugging
    console.log("AI Response:", chatCompletion.choices[0].message.content);

    // Extract JSON from the response using a regular expression
    const jsonMatch = chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
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

    // Validate the structure of the generated plan
    if (
      !generatedPlan.exercise_plan ||
      !generatedPlan.exercises ||
      !Array.isArray(generatedPlan.exercises)
    ) {
      throw new Error("AI response does not match the expected structure");
    }

    // Send the generated plan back to the frontend
    res.status(200).json(generatedPlan);
  } catch (error) {
    console.error("Error generating exercise plan:", error);
    res.status(500).json({ error: "Failed to generate exercise plan" });
  }
};

module.exports = { getExercisePlanByUser, generateExercisePlan };
