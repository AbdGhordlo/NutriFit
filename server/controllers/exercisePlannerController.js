const pool = require("../db");
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
        epe.id AS exercise_plan_exercise_id,
        epe.reps,
        epe.sets,
        epe.duration,
        TO_CHAR(epe.time, 'HH24:MI') AS time -- Format time to remove seconds
      FROM exercise_plan ep
      JOIN exercise_plan_exercise epe ON ep.id = epe.exercise_plan_id
      JOIN exercise e ON epe.exercise_id = e.id
      WHERE ep.user_id = $1 AND ep.is_adopted_plan = TRUE
      ORDER BY epe.day_number, epe.time, epe.exercise_order`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No adopted exercise plan found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const getAdoptedExercisePlanIdByUser = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT id 
       FROM exercise_plan 
       WHERE user_id = $1 AND is_adopted_plan = TRUE
       LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("No adopted meal plan found");
    }

    return result.rows[0].id;
  } catch (err) {
    console.error("Error fetching adopted meal plan ID:", err);
    throw err;
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
      return res
        .status(404)
        .json({ message: "No exercise plans found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// API: deepseek-r1-distill-llama-70b using Groq
const generateExercisePlan = async (req, res) => {
  const { userId } = req.body;
  const MAX_RETRIES = 3; // Maximum number of retries if JSON parsing fails
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Fetch the user's personalization data
      const personalizationData = await pool.query(
        `SELECT steps_data FROM personalization WHERE user_id = $1`,
        [userId]
      );

      if (personalizationData.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Personalization data not found" });
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
      - Height: ${personalInfo.height} cm
      - Weight: ${personalInfo.weight} kg
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} kg in ${
        weightGoal.timeframe
      } weeks
      - Health Issues: ${healthIssues.join(", ")}
      - Current Activity Level: ${activityLevel}
    `;

      // Define the system prompt with personalization
      const SYSTEM_PROMPT = `You are a helpful fitness trainer. Generate a personalized 7-day exercise plan in valid JSON format based on the user's profile. The plan should include multiple exercises for each day, tailored to the user's fitness level, goals, and available equipment.

    Requirements:
    - Focus on exercises that help achieve: ${fitnessGoal.type}
    - Consider the user's current activity level: ${activityLevel}
    - Avoid exercises that might affect these health issues: ${healthIssues.join(
      ", "
    )}

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
          "duration": null,
          "time": "08:00",
          "day_number": 1,
          "exercise_order": 1
        },
        {
          "name": "Exercise Name",
          "description": "Exercise Description",
          "calories_burned": 100,
          "has_reps_sets": false,
          "has_duration": true,
          "reps": null,
          "sets": null,
          "duration": "30m",
          "time": "12:00",
          "day_number": 1,
          "exercise_order": 1
        }
      ]
    }
    Include these exercise types each week:
    - Strength training (${
      fitnessGoal.type === "build_muscle" ? "4-5 days" : "2-3 days"
    })
    - Cardiovascular (${
      fitnessGoal.type === "lose_weight" ? "4-5 days" : "2-3 days"
    })
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
        max_tokens: 5000,
        top_p: 0.95,
        response_format: { type: "json_object" }, // Request JSON mode
        stream: false,
      });
      // console.log("AI Response:", chatCompletion.choices[0].message.content);

      // Extract and validate JSON response
      const jsonMatch =
        chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
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

      if (
        !generatedPlan.exercise_plan ||
        !generatedPlan.exercises ||
        !Array.isArray(generatedPlan.exercises)
      ) {
        throw new Error("AI response does not match the expected structure");
      }

      console.log("Plan Generated successfully!");
      return res.status(200).json(generatedPlan);
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed:`, error.message);

      if (retryCount >= MAX_RETRIES) {
        console.error("Max retries reached, giving up");
        return res.status(500).json({
          error: "Failed to generate meal plan",
          details: error.message,
        });
      }
    }
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
        [
          exercise.name,
          exercise.description,
          exercise.calories_burned,
          exercise.has_reps_sets,
          exercise.has_duration,
        ]
      );

      const exerciseId = exerciseResult.rows[0].id;

      await pool.query(
        `INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, time, reps, sets, duration) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          exercisePlanId,
          exerciseId,
          exercise.day_number,
          exercise.time,
          exercise.reps,
          exercise.sets,
          exercise.duration,
        ]
      );
    }

    res
      .status(200)
      .json({ message: "Exercise plan saved successfully!", exercisePlanId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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
        [
          exercise.name,
          exercise.description,
          exercise.calories_burned,
          exercise.has_reps_sets,
          exercise.has_duration,
        ]
      );

      const exerciseId = exerciseResult.rows[0].id;

      await pool.query(
        `INSERT INTO exercise_plan_exercise (exercise_plan_id, exercise_id, day_number, time, reps, sets, duration) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          exercisePlanId,
          exerciseId,
          exercise.day_number,
          exercise.time,
          exercise.reps,
          exercise.sets,
          exercise.duration,
        ]
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

    res
      .status(200)
      .json({ message: "Exercise plan saved and adopted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Remove a saved exercise plan
const removeSavedPlan = async (req, res) => {
  const { userId, planId } = req.body;

  try {
    // First check if the plan exists and belongs to the user
    const planCheck = await pool.query(
      `SELECT id FROM exercise_plan 
       WHERE id = $1 AND user_id = $2`,
      [planId, userId]
    );

    if (planCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Exercise plan not found or doesn't belong to user" });
    }

    // Check if this is the adopted plan
    const adoptedCheck = await pool.query(
      `SELECT is_adopted_plan FROM exercise_plan 
       WHERE id = $1`,
      [planId]
    );

    if (adoptedCheck.rows[0].is_adopted_plan) {
      return res
        .status(400)
        .json({ message: "Cannot remove currently adopted plan" });
    }

    // Delete the exercise plan (cascade will handle exercise_plan_exercise entries)
    const result = await pool.query(
      `DELETE FROM exercise_plan 
       WHERE id = $1 
       RETURNING id, name`,
      [planId]
    );

    res.json({
      message: "Exercise plan removed successfully",
      removedPlan: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
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
    res.status(500).send("Server error");
  }
};

// ---------------------------------- Edit Plan --------------------------------------------------------

const getFavoriteExercises = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT e.*, ufe.* 
       FROM user_favorite_exercises ufe
       JOIN exercise e ON ufe.exercise_id = e.id
       WHERE ufe.user_id = $1
       ORDER BY ufe.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Add exercise to favorites
const addFavoriteExercise = async (req, res) => {
  const { exerciseId, userId, reps, sets, duration, has_duration, has_reps_sets} = req.body;

  try {
    // Check if exercise exists
    const exerciseCheck = await pool.query(
      `SELECT id FROM exercise WHERE id = $1`,
      [exerciseId]
    );

    if (exerciseCheck.rows.length === 0) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    // Check if already favorited
    const existingFavorite = await pool.query(
      `SELECT id FROM user_favorite_exercises WHERE user_id = $1 AND exercise_id = $2`,
      [userId, exerciseId]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({ message: "Exercise already in favorites" });
    }
    // Add to favorites with configuration
    await pool.query(
      `INSERT INTO user_favorite_exercises 
       (user_id, exercise_id, reps, sets, duration) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, exerciseId, reps, sets, duration]
    );

    res.status(201).json({ message: "Exercise added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const removeFavoriteExercise = async (req, res) => {
  const { userId, exerciseId } = req.body;
  console.log("Removing favorite exercise:", exerciseId, "-", userId);

  try {
    // Verify the favorite exists
    const favoriteCheck = await pool.query(
      `SELECT * FROM user_favorite_exercises 
       WHERE user_id = $1 AND exercise_id = $2`,
      [userId, exerciseId]
    );

    if (favoriteCheck.rows.length === 0) {
      return res.status(404).json({ message: "Favorite exercise not found" });
    }

    // Delete the favorite
    const result = await pool.query(
      `DELETE FROM user_favorite_exercises 
       WHERE user_id = $1 AND exercise_id = $2 
       RETURNING *`,
      [userId, exerciseId]
    );

    res.json({
      message: "Exercise removed from favorites",
      removedExercise: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};

const replaceExerciseWithFavorite = async (req, res) => {
  const { userId, exercisePlanExerciseId, favoriteExerciseId } = req.body;

  try {
    // Verify the favorite exercise exists and belongs to the user, and get its configuration
    const favoriteCheck = await pool.query(
      `SELECT 
         e.*, 
         ufe.reps AS favorite_reps,
         ufe.sets AS favorite_sets,
         ufe.duration AS favorite_duration
       FROM user_favorite_exercises ufe
       JOIN exercise e ON ufe.exercise_id = e.id
       WHERE ufe.user_id = $1 AND ufe.exercise_id = $2`,
      [userId, favoriteExerciseId]
    );

    if (favoriteCheck.rows.length === 0) {
      return res.status(404).json({ message: "Favorite exercise not found" });
    }

    const favoriteData = favoriteCheck.rows[0];

    // Get the exercise plan exercise to replace
    const exercisePlanExercise = await pool.query(
      `SELECT * FROM exercise_plan_exercise WHERE id = $1`,
      [exercisePlanExerciseId]
    );

    if (exercisePlanExercise.rows.length === 0) {
      return res.status(404).json({ message: "Exercise plan exercise not found" });
    }

    // Update the exercise_plan_exercise with the favorite's data
    await pool.query(
      `UPDATE exercise_plan_exercise 
       SET exercise_id = $1,
           reps = $2,
           sets = $3,
           duration = $4
       WHERE id = $5`,
      [
        favoriteExerciseId,
        favoriteData.favorite_reps,
        favoriteData.favorite_sets,
        favoriteData.favorite_duration,
        exercisePlanExerciseId
      ]
    );

    // Get the updated exercise with all its details
    const updatedExercise = await pool.query(
      `SELECT e.*, epe.* 
       FROM exercise_plan_exercise epe
       JOIN exercise e ON epe.exercise_id = e.id
       WHERE epe.id = $1`,
      [exercisePlanExerciseId]
    );

    res.json({
      message: "Exercise replaced with favorite successfully",
      newExercise: updatedExercise.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};

// Regenerate a day's exercises
const regenerateDay = async (req, res) => {
  const { userId, dayNumber } = req.body;
  const MAX_RETRIES = 3;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      const exercisePlanId = await getAdoptedExercisePlanIdByUser(userId);

      // Get user's personalization data
      const personalizationData = await pool.query(
        `SELECT steps_data FROM personalization WHERE user_id = $1`,
        [userId]
      );

      if (personalizationData.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Personalization data not found" });
      }

      const { steps_data } = personalizationData.rows[0];
      const personalInfo = steps_data.step_1?.personalInfo || {};
      const fitnessGoal = steps_data.step_2?.fitnessGoal || {};
      const weightGoal = steps_data.step_2?.weightGoal || {};
      const healthIssues = steps_data.step_3?.healthIssues || ["none"];
      const activityLevel = steps_data.step_4?.activityLevel || "moderate";

      const userProfile = `
      User Profile:
      - Age: ${personalInfo.age}
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} cm
      - Weight: ${personalInfo.weight} kg
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} kg in ${
        weightGoal.timeframe
      } weeks
      - Health Issues: ${healthIssues.join(", ")}
      - Current Activity Level: ${activityLevel}
    `;

      const SYSTEM_PROMPT = `You are a helpful fitness trainer. Generate exercises for a single day (day ${dayNumber}) of 
    a meal plan in valid JSON format based on the user's profile.

    Requirements:
    - Focus on exercises that help achieve: ${fitnessGoal.type}
    - Consider the user's current activity level: ${activityLevel}
    - Avoid exercises that might affect these health issues: ${healthIssues.join(
      ", "
    )}

    The JSON structure should match this format:
    {
      "exercises": [
        {
          "name": "Exercise Name",
          "description": "Exercise Description",
          "calories_burned": 100,
          "has_reps_sets": true,
          "has_duration": false,
          "reps": 10,
          "sets": 3,
          "duration": null,
          "time": "08:00",
          "day_number": 1,
          "exercise_order": 1
        },
        {
          "name": "Exercise Name",
          "description": "Exercise Description",
          "calories_burned": 100,
          "has_reps_sets": false,
          "has_duration": true,
          "reps": null,
          "sets": null,
          "duration": "30m",
          "time": "12:00",
          "day_number": 1,
          "exercise_order": 1
        }
      ]
    }
      Make sure the response is valid JSON and does not include any additional text or explanations.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userProfile },
        ],
        model: "llama3-70b-8192",
        temperature: 0.6,
        max_tokens: 4096,
        top_p: 0.95,
        response_format: { type: "json_object" },
        stream: false,
      });

      // console.log("AI Response:", chatCompletion.choices[0].message.content);

      const jsonMatch =
        chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON found in AI response");

      const generatedDay = JSON.parse(jsonMatch[0]);
      if (!generatedDay.exercises || !Array.isArray(generatedDay.exercises)) {
        throw new Error("AI response does not match the expected structure");
      }

      await pool.query(
        `DELETE FROM exercise_plan_exercise
       WHERE exercise_plan_id = $1 AND day_number = $2
       RETURNING exercise_id`,
        [exercisePlanId, dayNumber]
      );

      for (const exercise of generatedDay.exercises) {
        const exerciseResult = await pool.query(
          `INSERT INTO exercise (name, description, calories_burned, has_reps_sets, has_duration) 
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [
            exercise.name,
            exercise.description,
            exercise.calories_burned,
            exercise.has_reps_sets,
            exercise.has_duration,
          ]
        );

        await pool.query(
          `INSERT INTO exercise_plan_exercise (
      exercise_plan_id,
      exercise_id,
      day_number,
      exercise_order,
      time,
      reps,
      sets,
      duration
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            exercisePlanId,
            exerciseResult.rows[0].id,
            dayNumber,
            exercise.exercise_order,
            exercise.time || "08:00", // fallback to default time if not provided
            exercise.reps || null,
            exercise.sets || null,
            exercise.duration || null,
          ]
        );
      }

      console.log("Day Regenerated successfully!")
      return res.status(200).json(generatedDay);
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed:`, error.message);

      if (retryCount >= MAX_RETRIES) {
        console.error("Max retries reached, giving up");
        return res.status(500).json({
          error: "Failed to generate day exercise plan",
          details: error.message,
        });
      }
    }
  }
};

const regenerateExercise = async (req, res) => {
  const { userId, exercisePlanExerciseId } = req.body;
  const MAX_RETRIES = 3;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Get the existing exercise details
      const existingExercise = await pool.query(
        `SELECT epe.*, e.name, e.description, e.calories_burned, 
                e.has_reps_sets, e.has_duration
         FROM exercise_plan_exercise epe
         JOIN exercise e ON epe.exercise_id = e.id
         WHERE epe.id = $1 AND epe.exercise_plan_id IN (
           SELECT id FROM exercise_plan WHERE user_id = $2
         )`,
        [exercisePlanExerciseId, userId]
      );

      if (existingExercise.rows.length === 0) {
        return res.status(404).json({ error: "Exercise not found or doesn't belong to user" });
      }

      const currentExercise = existingExercise.rows[0];

      // Get user's personalization data
      const personalizationData = await pool.query(
        `SELECT steps_data FROM personalization WHERE user_id = $1`,
        [userId]
      );

      if (personalizationData.rows.length === 0) {
        return res.status(404).json({ error: "Personalization data not found" });
      }

      const { steps_data } = personalizationData.rows[0];
      const personalInfo = steps_data.step_1?.personalInfo || {};
      const fitnessGoal = steps_data.step_2?.fitnessGoal || {};
      const weightGoal = steps_data.step_2?.weightGoal || {};
      const healthIssues = steps_data.step_3?.healthIssues || ["none"];
      const activityLevel = steps_data.step_4?.activityLevel || "moderate";

      const userProfile = `
        User Profile:
        - Age: ${personalInfo.age}
        - Gender: ${personalInfo.gender}
        - Height: ${personalInfo.height} cm
        - Weight: ${personalInfo.weight} kg
        - Fitness Goal: ${fitnessGoal.type}
        - Weight Goal: ${weightGoal.targetWeight} kg in ${weightGoal.timeframe} weeks
        - Health Issues: ${healthIssues.join(", ")}
        - Current Activity Level: ${activityLevel}
      `;

      const SYSTEM_PROMPT = `You are a helpful fitness trainer. Regenerate a single exercise to replace an existing one in a workout plan.
      
      Current Exercise:
      - Name: ${currentExercise.name}
      - Description: ${currentExercise.description}
      - Reps: ${currentExercise.reps || 'N/A'}
      - Sets: ${currentExercise.sets || 'N/A'}
      - Duration: ${currentExercise.duration || 'N/A'}

      Requirements:
      - Should be a different exercise than the current one
      - Focus on exercises that help achieve: ${fitnessGoal.type}
      - Consider the user's current activity level: ${activityLevel}
      - Avoid exercises that might affect these health issues: ${healthIssues.join(", ")}

      The JSON structure should match this format:
      {
        "exercise": {
          "name": "Exercise Name",
          "description": "Exercise Description",
          "calories_burned": 100,
          "has_reps_sets": true,
          "has_duration": false,
          "reps": null,
          "sets": null,
          "duration": "10m"
        }
      }
      Make sure the response is valid JSON and does not include any additional text or explanations.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userProfile },
        ],
        model: "llama3-70b-8192",
        temperature: 0.7, // Slightly higher temperature for more variety
        max_tokens: 4096,
        top_p: 0.95,
        response_format: { type: "json_object" },
        stream: false,
      });

      // console.log("AI Response:", chatCompletion.choices[0].message.content);

      const jsonMatch = chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON found in AI response");

      const generatedExercise = JSON.parse(jsonMatch[0]);
      if (!generatedExercise.exercise) {
        throw new Error("AI response does not match the expected structure");
      }

      // Create new exercise
      const exerciseResult = await pool.query(
        `INSERT INTO exercise (name, description, calories_burned, has_reps_sets, has_duration) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          generatedExercise.exercise.name,
          generatedExercise.exercise.description,
          generatedExercise.exercise.calories_burned,
          generatedExercise.exercise.has_reps_sets,
          generatedExercise.exercise.has_duration,
        ]
      );

      // Update the exercise_plan_exercise record
      await pool.query(
        `UPDATE exercise_plan_exercise 
         SET exercise_id = $1,
             reps = $2,
             sets = $3,
             duration = $4
         WHERE id = $5`,
        [
          exerciseResult.rows[0].id,
          generatedExercise.exercise.reps || null,
          generatedExercise.exercise.sets || null,
          generatedExercise.exercise.duration || null,
          exercisePlanExerciseId
        ]
      );

      console.log("Exercise Regenerated successfully!")
      return res.status(200).json(generatedExercise.exercise);
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed:`, error.message);

      if (retryCount >= MAX_RETRIES) {
        console.error("Max retries reached, giving up");
        return res.status(500).json({
          error: "Failed to regenerate exercise",
          details: error.message,
        });
      }
    }
  }
};

// Get today's exercises for a user from their adopted exercise plan
const getTodaysExercisesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // First, get the adopted exercise plan and its adoption date
    const exercisePlanResult = await pool.query(
      `SELECT id, updated_at
       FROM exercise_plan 
       WHERE user_id = $1 AND is_adopted_plan = TRUE
       LIMIT 1`,
      [userId]
    );

    if (exercisePlanResult.rows.length === 0) {
      return res.status(404).json({ message: "No adopted exercise plan found for this user." });
    }

    const exercisePlan = exercisePlanResult.rows[0];
    const adoptionDate = new Date(exercisePlan.updated_at);
    const currentDate = new Date();

    // Calculate days since adoption (starting from day 1)
    const timeDifference = currentDate.getTime() - adoptionDate.getTime();
    const daysSinceAdoption = Math.floor(timeDifference / (1000 * 3600 * 24));
    const currentDayNumber = (daysSinceAdoption % 7) + 1;

    const result = await pool.query(
      `SELECT 
        epe.id AS exercise_plan_exercise_id,
        e.id AS exercise_id,
        e.name AS exercise_name,
        e.description AS exercise_description,
        e.calories_burned,
        e.has_reps_sets,
        e.has_duration,
        epe.reps,
        epe.sets,
        epe.duration,
        epe.exercise_order,
        TO_CHAR(epe.time, 'HH24:MI') AS time
      FROM exercise_plan ep
      JOIN exercise_plan_exercise epe ON ep.id = epe.exercise_plan_id
      JOIN exercise e ON epe.exercise_id = e.id
      WHERE ep.user_id = $1 AND ep.is_adopted_plan = TRUE AND epe.day_number = $2
      ORDER BY epe.exercise_order`,
      [userId, currentDayNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No exercises found for today in the adopted plan." });
    }

    const exercises = result.rows.map(ex => ({
      id: ex.exercise_plan_exercise_id,
      exerciseId: ex.exercise_id,
      name: ex.exercise_name,
      description: ex.exercise_description,
      time: ex.time,
      calories_burned: ex.calories_burned,
      has_reps_sets: ex.has_reps_sets,
      has_duration: ex.has_duration,
      reps: ex.reps,
      sets: ex.sets,
      duration: ex.duration,
      exerciseOrder: ex.exercise_order,
      completed: false
    }));

    res.json({
      exercises,
      currentDay: currentDayNumber,
      daysSinceAdoption: daysSinceAdoption,
      adoptionDate: adoptionDate.toISOString().split('T')[0]
    });
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
  removeSavedPlan,
  getFavoriteExercises,
  addFavoriteExercise,
  regenerateDay,
  regenerateExercise,
  removeFavoriteExercise,
  replaceExerciseWithFavorite,
  getTodaysExercisesByUser
};
