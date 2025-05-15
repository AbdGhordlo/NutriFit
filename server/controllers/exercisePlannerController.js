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
    const { userId } = req.params;

    // Fetch the user's personalization data
    const personalizationData = await pool.query(
      `SELECT steps_data FROM personalization WHERE user_id = $1`,
      [userId]
    );

    if (personalizationData.rows.length === 0) {
      return res.status(404).json({ error: "Personalization data not found" });
    }

    const { steps_data } = personalizationData.rows[0];
    
    // Extract relevant personalization data for exercise planning
    const personalInfo = steps_data.step_1?.personalInfo || {};
    const fitnessGoal = steps_data.step_2?.fitnessGoal || {};
    const weightGoal = steps_data.step_2?.weightGoal || {};
    const healthIssues = steps_data.step_3?.healthIssues || ["none"];
    const activityLevel = steps_data.step_4?.activityLevel || "moderate";

    // Create a detailed user profile for the prompt
    const userProfile = `
      User Profile:
      - Age: ${personalInfo.age}
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} inches
      - Weight: ${personalInfo.weight} lbs
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} lbs in ${weightGoal.timeframe} weeks
      - Health Issues: ${healthIssues.join(", ")}
      - Current Activity Level: ${activityLevel}
    `;

    // Define the system prompt with personalization
    const SYSTEM_PROMPT = `You are a helpful fitness trainer. Generate a personalized 7-day exercise plan in valid JSON format based on the user's profile. The plan should include multiple exercises for each day, tailored to the user's fitness level, goals, and available equipment.

    Requirements:
    - Focus on exercises that help achieve: ${fitnessGoal.type}
    - Consider the user's current activity level: ${activityLevel}
    - Avoid exercises that might affect these health issues: ${healthIssues.join(", ")}
    - Gradually increase intensity based on user's current fitness level

    The JSON structure should match this format:
    {
      "exercise_plan": {
        "name": "7-Day Personalized Exercise Plan",
        "description": "A balanced exercise plan tailored to the user's needs."
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
          "day_number": 1,
          "intensity": "moderate",
          "type": "strength"
        },
        {
          "name": "Exercise Name",
          "description": "Exercise Description",
          "calories_burned": 100,
          "has_reps_sets": false,
          "has_duration": true,
          "duration": 30,
          "time": "12:00",
          "day_number": 1,
          "intensity": "light",
          "type": "cardio"
        }
      ]
    }
    Include these exercise types each week:
    - Strength training (${fitnessGoal.type === 'build_muscle' ? '4-5 days' : '2-3 days'})
    - Cardiovascular (${fitnessGoal.type === 'lose_weight' ? '4-5 days' : '2-3 days'})
    - Flexibility/mobility (2-3 days)
    Make sure the response is valid JSON and does not include any additional text or explanations.`;

    // Make the request to Groq with both system prompt and user profile
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userProfile },
      ],
      model: "llama3-70b-8192",
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 0.95,
      stream: false,
    });

    // Extract and validate JSON response
    const jsonMatch = chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    let generatedPlan;
    try {
      generatedPlan = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      throw new Error("AI response is not valid JSON");
    }

    if (!generatedPlan.exercise_plan || !generatedPlan.exercises || !Array.isArray(generatedPlan.exercises)) {
      throw new Error("AI response does not match the expected structure");
    }

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