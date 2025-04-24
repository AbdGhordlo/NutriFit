const pool = require('../db');
const Groq = require("groq-sdk");
const groq = new Groq(process.env.GROQ_API_KEY);

const getAdoptedExercisePlanByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        ep.id AS exercise_plan_id,
        ep.name AS exercise_plan_name,
        ep.description AS exercise_plan_description,
        epe.day_number,
        epe.exercise_order,
        e.id AS exercise_id,
        e.name AS exercise_name,
        e.description AS exercise_description,
        e.calories_burned,
        e.has_reps_sets,
        e.has_duration,
        epe.reps,
        epe.sets,
        epe.duration,
        TO_CHAR(epe.time, 'HH24:MI') AS time -- Format time to remove seconds
      FROM exercise_plan ep
      JOIN exercise_plan_exercise epe ON ep.id = epe.exercise_plan_id
      JOIN exercise e ON epe.exercise_id = e.id
      WHERE ep.user_id = $1 AND ep.is_adopted_plan = TRUE
      ORDER BY epe.day_number, epe.exercise_order`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No adopted exercise plan found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getAllExercisePlansByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        id AS exercise_plan_id,
        name AS exercise_plan_name,
        description AS exercise_plan_description,
        is_adopted_plan
      FROM exercise_plan
      WHERE user_id = $1
      ORDER BY is_adopted_plan DESC, created_at DESC`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No exercise plans found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// API: deepseek-r1-distill-llama-70b using Groq
const generateExercisePlan = async (req, res) => {
  try {
    // Define the system prompt to guide the AI
    const SYSTEM_PROMPT = `You are a helpful fitness trainer. Generate a 7-day exercise plan in valid JSON format. The plan should include multiple exercises for each day. Each exercise should have a name, description, calories burned, whether it has reps/sets, whether it has duration, and time. The JSON structure should match this format:
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

const saveExercisePlan = async (req, res) => {
  const { userId, plan } = req.body;

  try {
    // Save the exercise plan to the database
    const exercisePlanResult = await pool.query(
      `INSERT INTO exercise_plan (user_id, name, description) VALUES ($1, $2, $3) RETURNING id`,
      [userId, plan.exercise_plan.name, plan.exercise_plan.description]
    );

    const exercisePlanId = exercisePlanResult.rows[0].id;

    // Save each exercise in the plan
    for (const exercise of plan.exercises) {
      const exerciseResult = await pool.query(
        `INSERT INTO exercise (name, description, calories_burned, has_reps_sets, has_duration) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [exercise.name, exercise.description, exercise.calories_burned, exercise.has_reps_sets, exercise.has_duration]
      );

      const exerciseId = exerciseResult.rows[0].id;

      await pool.query(
        `INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, time, reps, sets, duration) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [exercisePlanId, exerciseId, exercise.day_number, exercise.time, exercise.reps, exercise.sets, exercise.duration]
      );
    }

    res.status(200).json({ message: "Exercise plan saved successfully!", exercisePlanId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const saveAndAdoptExercisePlan = async (req, res) => {
  const { userId, plan } = req.body;

  try {
    // Save the exercise plan to the database
    const exercisePlanResult = await pool.query(
      `INSERT INTO exercise_plan (user_id, name, description) VALUES ($1, $2, $3) RETURNING id`,
      [userId, plan.exercise_plan.name, plan.exercise_plan.description]
    );

    const exercisePlanId = exercisePlanResult.rows[0].id;

    // Save each exercise in the plan
    for (const exercise of plan.exercises) {
      const exerciseResult = await pool.query(
        `INSERT INTO exercise (name, description, calories_burned, has_reps_sets, has_duration) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [exercise.name, exercise.description, exercise.calories_burned, exercise.has_reps_sets, exercise.has_duration]
      );

      const exerciseId = exerciseResult.rows[0].id;

      await pool.query(
        `INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, time, reps, sets, duration) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [exercisePlanId, exerciseId, exercise.day_number, exercise.time, exercise.reps, exercise.sets, exercise.duration]
      );
    }

    // Set all existing plans for the user to is_adopted_plan = FALSE
    await pool.query(
      `UPDATE exercise_plan SET is_adopted_plan = FALSE WHERE user_id = $1`,
      [userId]
    );

    // Set the newly saved plan as adopted
    await pool.query(
      `UPDATE exercise_plan SET is_adopted_plan = TRUE WHERE id = $1`,
      [exercisePlanId]
    );

    res.status(200).json({ message: "Exercise plan saved and adopted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const adoptExercisePlan = async (req, res) => {
  const { userId, exercisePlanId } = req.body;

  try {
    // Set all existing plans for the user to is_adopted_plan = FALSE
    await pool.query(
      `UPDATE exercise_plan SET is_adopted_plan = FALSE WHERE user_id = $1`,
      [userId]
    );

    // Set the selected plan as adopted
    await pool.query(
      `UPDATE exercise_plan SET is_adopted_plan = TRUE WHERE id = $1 AND user_id = $2`,
      [exercisePlanId, userId]
    );

    res.status(200).json({ message: "Exercise plan adopted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAdoptedExercisePlanByUser,
  getAllExercisePlansByUser,
  generateExercisePlan,
  saveExercisePlan,
  saveAndAdoptExercisePlan,
  adoptExercisePlan,
};