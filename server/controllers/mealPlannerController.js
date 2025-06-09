const pool = require("../db");
const { HfInference } = require("@huggingface/inference"); // Import Hugging Face Inference
const Groq = require("groq-sdk");
const { getInStockUserIngredients } = require("./ingredientsController");
const hf = new HfInference(process.env.HF_ACCESS_TOKEN); // Initialize with your Hugging Face token
const groq = new Groq(process.env.GROQ_API_KEY);

const getAdoptedMealPlanByUser = async (req, res) => {
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
      WHERE mp.user_id = $1 AND mp.is_adopted_plan = TRUE
      ORDER BY mpm.day_number, mpm.meal_order`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No adopted meal plan found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const getAdoptedMealPlanIdByUser = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT id 
       FROM meal_plan 
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

const getAllMealPlansByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        id AS meal_plan_id,
        name AS meal_plan_name,
        description AS meal_plan_description,
        is_adopted_plan
      FROM meal_plan
      WHERE user_id = $1
      ORDER BY is_adopted_plan DESC, created_at DESC`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No meal plans found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const getTodaysMealsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // First, get the adopted meal plan and its adoption date
    const mealPlanResult = await pool.query(
      `SELECT id, updated_at
       FROM meal_plan 
       WHERE user_id = $1 AND is_adopted_plan = TRUE
       LIMIT 1`,
      [userId]
    );

    if (mealPlanResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No adopted meal plan found for this user." });
    }

    const mealPlan = mealPlanResult.rows[0];
    const adoptionDate = new Date(mealPlan.updated_at);
    const currentDate = new Date();

    // Calculate days since adoption (starting from day 1)
    const timeDifference = currentDate.getTime() - adoptionDate.getTime();
    const daysSinceAdoption = Math.floor(timeDifference / (1000 * 3600 * 24));
    const currentDayNumber = (daysSinceAdoption % 7) + 1; // Assuming 7-day cycle, adjust as needed

    const result = await pool.query(
      `SELECT 
        mpm.id AS meal_plan_meal_id,
        m.id AS meal_id,
        m.name AS meal_name,
        m.description AS meal_description,
        m.calories,
        m.protein,
        m.carbs,
        m.fats,
        mpm.meal_order,
        TO_CHAR(mpm.time, 'HH24:MI') AS time
      FROM meal_plan mp
      JOIN meal_plan_meal mpm ON mp.id = mpm.meal_plan_id
      JOIN meal m ON mpm.meal_id = m.id
      WHERE mp.user_id = $1 AND mp.is_adopted_plan = TRUE AND mpm.day_number = $2
      ORDER BY mpm.meal_order`,
      [userId, currentDayNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No meals found for today.",
        currentDay: currentDayNumber,
        daysSinceAdoption: daysSinceAdoption,
      });
    }

    const meals = result.rows.map((meal) => ({
      id: meal.meal_plan_meal_id,
      mealId: meal.meal_id,
      name: meal.meal_name,
      description: meal.meal_description,
      time: meal.time,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      mealOrder: meal.meal_order,
      completed: false, // Will be handled by separate completion table later
    }));

    res.json({
      meals,
      currentDay: currentDayNumber,
      daysSinceAdoption: daysSinceAdoption,
      adoptionDate: adoptionDate.toISOString().split("T")[0], // Just the date part
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const getMealPlan = async (req, res) => {
  const { userId } = req.body;
  const MAX_RETRIES = 3; // Maximum number of retries if JSON parsing fails
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Try to fetch the user's personalization data
      let personalizationData;
      let useDefaultPlan = false;

      try {
        // Fetch both personalization data and ingredients in parallel
        [personalizationData, ingredients] = await Promise.all([
          pool.query(
            `SELECT steps_data FROM personalization WHERE user_id = $1`,
            [userId]
          ),
          getInStockUserIngredients(userId),
        ]);
        console.log("ingredients given to AI: ", ingredients);

        if (personalizationData.rows.length === 0) {
          useDefaultPlan = true;
        }
      } catch (dbError) {
        console.error("Error fetching personalization data:", dbError);
        useDefaultPlan = true;
      }

      // Define the system prompt based on whether we have personalization data
      let SYSTEM_PROMPT;
      let userProfile;
      let JSON_structure = `The JSON structure should match this format:
        "meal_plan": {
          "name": "7-Day Personalized Meal Plan",
          "description": "A balanced meal plan..."
        },
        "meals": [
          {
            "name": "Meal Name",
            "description": "Meal description...",
            "calories": 500,
            "protein": 30,
            "carbs": 50,
            "fats": 20,
            "time": "08:00",
            "day_number": 1,
            "meal_order": 1
          }
        ]
      }`;

      if (useDefaultPlan) {
        SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a typical healthy 7-day meal plan in valid JSON format. 
        The plan should be balanced and suitable for an average adult with no specific health concerns.
        
        ${JSON_structure}

        Make sure the response is valid JSON and does not include any additional text or explanations.`;

        userProfile =
          "User has no personalization data. Generate a default healthy exercise plan.";
      } else {
        const { steps_data } = personalizationData.rows[0];
        // Extract relevant personalization data
        const personalInfo = steps_data.step_1?.personalInfo || {};
        const fitnessGoal = steps_data.step_2?.fitnessGoal || {};
        const weightGoal = steps_data.step_2?.weightGoal || {};
        const cuisinePreferences = steps_data.step_3?.cuisinePreferences || [];
        const dietPreference = steps_data.step_3?.dietPreference || "none";
        const healthIssues = steps_data.step_3?.healthIssues || ["none"];
        const mealsPerDay = steps_data.step_3?.mealsPerDay || 3;
        const activityLevel = steps_data.step_4?.activityLevel || "moderate";
        const budget = steps_data.step_5?.budget || "basic";

        // Format ingredients for the prompt
        const ingredientsList = ingredients
          .map((ing) => `${ing.ingredient_name} (${ing.ingredient_category})`)
          .join(", ");

        // Create a detailed user profile for the prompt
        userProfile = `
      User Profile:
      - Age: ${personalInfo.age}
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} cm
      - Weight: ${personalInfo.weight} kgs
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} kgs in ${
          weightGoal.timeframe
        } weeks
      - Cuisine Preferences: ${cuisinePreferences.join(", ")}
      - Diet Preference: ${dietPreference}
      - Health Issues: ${healthIssues.join(", ")}
      - Activity Level: ${activityLevel}
      - Budget: ${budget}
      - Available Ingredients: ${ingredientsList}
      `;

        SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a personalized 7-day meal plan in valid JSON format based on the user's profile and available ingredients. 

      IMPORTANT INSTRUCTIONS:
      1. Return ONLY valid JSON with no additional text before or after
      2. Ensure all strings are properly quoted with double quotes
      3. Include all required fields for each meal
      4. EVERY meal MUST include the time field

      Requirements:
      - Generate exactly ${mealsPerDay} meals per day for 7 days (total ${
          mealsPerDay * 7
        } meals)
      - Ensure each meal has: name, description, calories, protein, carbs, fats, time, day_number, and meal_order
      - Strictly follow dietary restrictions: ${dietPreference}
      - Avoid ingredients that might affect these health issues: ${healthIssues.join(
        ", "
      )}
      - Prioritize these cuisines: ${cuisinePreferences.join(", ")}
      - Budget level: ${budget}
      - Target calories based on user's weight goal and activity level
      - Prioritize using these available ingredients: ${ingredientsList}
      - Ensure good variety between days (don't repeat the same meals every day)
      - For meal_order: 1=breakfast, 2=lunch, 3=dinner, 4+=snacks

      ${JSON_structure}
      
        Make sure the response is valid JSON and does not include any additional text or explanations.
    And make sure you generate the full plan, not just one day.`;
      }
      // Make the request to Groq with both system prompt and user profile
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT }, // System prompt to guide the AI
          { role: "user", content: userProfile }, // User prompt
        ],
        //model: "deepseek-r1-distill-llama-70b", // Use the desired model
        model: "llama3-70b-8192", // Use the desired model
        //temperature: 0.6, // Adjust for creativity
        temperature: 0.4, // Adjust for creativity
        max_tokens: 5000, // Adjust based on your needs
        top_p: 0.95, // Adjust for diversity
        response_format: { type: "json_object" }, // Request JSON mode
        stream: false, // Disable streaming for a single response
      });

      // Log the response for debugging
      console.log("AI Response:", chatCompletion.choices[0].message.content);

      // Extract JSON from the response using a regular expression
      const jsonMatch =
        chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
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
        !generatedPlan.meal_plan ||
        !generatedPlan.meals ||
        !Array.isArray(generatedPlan.meals)
      ) {
        throw new Error("AI response does not match the expected structure");
      }

      // Send the generated plan back to the frontend
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

const saveMealPlan = async (req, res) => {
  const { userId, plan } = req.body;

  try {
    // Save the meal plan to the database
    const mealPlanResult = await pool.query(
      `INSERT INTO meal_plan (user_id, name, description) VALUES ($1, $2, $3) RETURNING id`,
      [userId, plan.meal_plan.name, plan.meal_plan.description]
    );

    const mealPlanId = mealPlanResult.rows[0].id;

    // Save each meal in the plan
    for (const meal of plan.meals) {
      const mealResult = await pool.query(
        `INSERT INTO meal (name, description, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          meal.name,
          meal.description,
          meal.calories,
          meal.protein,
          meal.carbs,
          meal.fats,
        ]
      );

      const mealId = mealResult.rows[0].id;

      await pool.query(
        `INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES ($1, $2, $3, $4, $5)`,
        [mealPlanId, mealId, meal.day_number, meal.meal_order, meal.time]
      );
    }

    res
      .status(200)
      .json({ message: "Meal plan saved successfully!", mealPlanId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const saveAndAdoptMealPlan = async (req, res) => {
  const { userId, plan } = req.body;

  try {
    // Save the meal plan to the database
    const mealPlanResult = await pool.query(
      `INSERT INTO meal_plan (user_id, name, description) VALUES ($1, $2, $3) RETURNING id`,
      [userId, plan.meal_plan.name, plan.meal_plan.description]
    );

    const mealPlanId = mealPlanResult.rows[0].id;

    // Save each meal in the plan
    for (const meal of plan.meals) {
      const mealResult = await pool.query(
        `INSERT INTO meal (name, description, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          meal.name,
          meal.description,
          meal.calories,
          meal.protein,
          meal.carbs,
          meal.fats,
        ]
      );

      const mealId = mealResult.rows[0].id;

      await pool.query(
        `INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES ($1, $2, $3, $4, $5)`,
        [mealPlanId, mealId, meal.day_number, meal.meal_order, meal.time]
      );
    }

    // Set all existing plans for the user to is_adopted_plan = FALSE
    await pool.query(
      `UPDATE meal_plan SET is_adopted_plan = FALSE WHERE user_id = $1`,
      [userId]
    );

    // Set the newly saved plan as adopted
    await pool.query(
      `UPDATE meal_plan SET is_adopted_plan = TRUE WHERE id = $1`,
      [mealPlanId]
    );

    res
      .status(200)
      .json({ message: "Meal plan saved and adopted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const adoptMealPlan = async (req, res) => {
  const { userId, mealPlanId } = req.body;

  try {
    // Set all existing plans for the user to is_adopted_plan = FALSE
    await pool.query(
      `UPDATE meal_plan SET is_adopted_plan = FALSE WHERE user_id = $1`,
      [userId]
    );

    // Set the selected plan as adopted
    await pool.query(
      `UPDATE meal_plan SET is_adopted_plan = TRUE WHERE id = $1 AND user_id = $2`,
      [mealPlanId, userId]
    );

    res.status(200).json({ message: "Meal plan adopted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Remove a saved meal plan
const removeSavedPlan = async (req, res) => {
  const { userId, planId } = req.body;

  try {
    // First check if the plan exists and belongs to the user
    const planCheck = await pool.query(
      `SELECT id FROM meal_plan 
       WHERE id = $1 AND user_id = $2`,
      [planId, userId]
    );

    if (planCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Meal plan not found or doesn't belong to user" });
    }

    // Check if this is the adopted plan
    const adoptedCheck = await pool.query(
      `SELECT is_adopted_plan FROM meal_plan 
       WHERE id = $1`,
      [planId]
    );

    if (adoptedCheck.rows[0].is_adopted_plan) {
      return res
        .status(400)
        .json({ message: "Cannot remove currently adopted plan" });
    }

    // Delete the meal plan (cascade will handle meal_plan_meal entries)
    const result = await pool.query(
      `DELETE FROM meal_plan 
       WHERE id = $1 
       RETURNING id, name`,
      [planId]
    );

    res.json({
      message: "Meal plan removed successfully",
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

// ---------------------------------- Edit Plan --------------------------------------------------------

// Get user's favorite meals
const getFavoriteMeals = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        m.id,
        m.name,
        m.description,
        m.calories,
        m.protein,
        m.carbs,
        m.fats,
        ufm.meal_id
      FROM user_favorite_meals ufm
      JOIN meal m ON ufm.meal_id = m.id
      WHERE ufm.user_id = $1
      ORDER BY ufm.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Add meal to favorites
const addFavoriteMeal = async (req, res) => {
  const { mealId, userId } = req.body;

  try {
    // First check if the meal exists
    const mealCheck = await pool.query(`SELECT id FROM meal WHERE id = $1`, [
      mealId,
    ]);

    if (mealCheck.rows.length === 0) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Check if already favorited
    const existingFavorite = await pool.query(
      `SELECT id FROM user_favorite_meals WHERE user_id = $1 AND meal_id = $2`,
      [userId, mealId]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({ message: "Meal already in favorites" });
    }

    // Add to favorites
    await pool.query(
      `INSERT INTO user_favorite_meals (user_id, meal_id) VALUES ($1, $2)`,
      [userId, mealId]
    );

    res.status(201).json({ message: "Meal added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Remove meal from favorites
const removeFavoriteMeal = async (req, res) => {
  const { userId, mealId } = req.body;
  console.log("removing: ", mealId, "-", userId);

  try {
    // First verify the favorite exists
    const favoriteCheck = await pool.query(
      `SELECT * FROM user_favorite_meals 
       WHERE user_id = $1 AND meal_id = $2`,
      [userId, mealId]
    );

    if (favoriteCheck.rows.length === 0) {
      return res.status(404).json({ message: "Favorite meal not found" });
    }

    // Delete the favorite
    const result = await pool.query(
      `DELETE FROM user_favorite_meals 
       WHERE user_id = $1 AND meal_id = $2 
       RETURNING *`,
      [userId, mealId]
    );

    res.json({
      message: "Meal removed from favorites",
      removedMeal: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
};

// Regenerate a specific day's meals
const regenerateDay = async (req, res) => {
  const { userId, dayNumber } = req.body;
  const MAX_RETRIES = 3;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      const mealPlanId = await getAdoptedMealPlanIdByUser(userId);

      let personalizationData;
      let useDefaultPlan = false;

      try {
        // Fetch both personalization data and ingredients in parallel
        [personalizationData, ingredients] = await Promise.all([
          pool.query(
            `SELECT steps_data FROM personalization WHERE user_id = $1`,
            [userId]
          ),
          getInStockUserIngredients(userId),
        ]);
        console.log("ingredients given to AI: ", ingredients);

        if (personalizationData.rows.length === 0) {
          useDefaultPlan = true;
        }
      } catch (dbError) {
        console.error("Error fetching personalization data:", dbError);
        useDefaultPlan = true;
      }

      // Define the system prompt based on whether we have personalization data
      let SYSTEM_PROMPT;
      let userProfile;
      let JSON_structure = `The JSON structure should match this format:
      "meals": [
        {
          "name": "Meal Name",
          "description": "Meal Description",
          "calories": 500,
          "protein": 30,
          "carbs": 50,
          "fats": 20,
          "time": "08:00",
          "meal_order": 1
        }
      ]
    }`;

      if (useDefaultPlan) {
        SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a typical healthy 1-day meal plan in valid JSON format. 
        The plan should be balanced and suitable for an average adult with no specific health concerns.
        
        ${JSON_structure}

        Make sure the response is valid JSON and does not include any additional text or explanations.`;

        userProfile =
          "User has no personalization data. Generate a default healthy exercise plan.";
      } else {
        const { steps_data } = personalizationData.rows[0];
        // Extract relevant personalization data (same as in getMealPlan)
        const personalInfo = steps_data.step_1?.personalInfo || {};
        const fitnessGoal = steps_data.step_2?.fitnessGoal || {};
        const weightGoal = steps_data.step_2?.weightGoal || {};
        const cuisinePreferences = steps_data.step_3?.cuisinePreferences || [];
        const dietPreference = steps_data.step_3?.dietPreference || "none";
        const healthIssues = steps_data.step_3?.healthIssues || ["none"];
        const mealsPerDay = steps_data.step_3?.mealsPerDay || 3;
        const activityLevel = steps_data.step_4?.activityLevel || "moderate";
        const budget = steps_data.step_5?.budget || "basic";

        // Format ingredients for the prompt
        const ingredientsList = ingredients
          .map((ing) => `${ing.ingredient_name} (${ing.ingredient_category})`)
          .join(", ");

        // Create a detailed user profile for the prompt
        userProfile = `
      User Profile:
      - Age: ${personalInfo.age}
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} cm
      - Weight: ${personalInfo.weight} kg
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} kg in ${
          weightGoal.timeframe
        } weeks
      - Cuisine Preferences: ${cuisinePreferences.join(", ")}
      - Diet Preference: ${dietPreference}
      - Health Issues: ${healthIssues.join(", ")}
      - Meals Per Day: ${mealsPerDay}
      - Activity Level: ${activityLevel}
      - Budget: ${budget}
      - Available Ingredients: ${ingredientsList}
    `;

        // Create prompt specifically for regenerating one day
        SYSTEM_PROMPT = `You are a helpful nutritionist. Generate meals for a single day (day ${dayNumber}) of a meal plan in valid JSON format based on the user's
    profile and available ingredients. The plan should include meals for breakfast, lunch, and dinner each day, or more meals if specified. 
    Each meal should have a name, description, calories, protein, carbs, fats, and time. Consider the user's dietary restrictions, preferences, 
    goals, and available ingredients.
    
    Requirements:
    - Generate exactly ${mealsPerDay} meals for this day
    - Maintain the same meal order as the original plan
    - Strictly follow dietary restrictions: ${dietPreference}
    - Avoid ingredients that might affect these health issues: ${healthIssues.join(
      ", "
    )}
    - Prioritize these cuisines: ${cuisinePreferences.join(", ")}
    - Budget level: ${budget}
    - Target calories based on user's weight goal and activity level
    - Make sure the total calories in a single day meet the Target Calories
    - Prioritize using these available ingredients: ${ingredientsList}
    - Only include meals that can be made with available ingredients or common pantry staples (salt, pepper, basic spices)
    - If no suitable meals can be made with available ingredients, suggest simple meals that require minimal additional ingredients
    
    IMPORTANT INSTRUCTIONS:
      1. Return ONLY valid JSON with no additional text before or after
      2. Ensure all strings are properly quoted with double quotes
      3. Include all required fields for each meal
      4. EVERY meal MUST include the time field
      
    ${JSON_structure}

    Make sure the response is valid JSON and does not include any additional text or explanations.`;
      }
      // Call Groq API
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userProfile },
        ],
        model: "llama3-70b-8192",
        temperature: 0.4,
        max_tokens: 5000,
        top_p: 0.95,
        response_format: { type: "json_object" },
        stream: false,
      });

      console.log("AI Response:", chatCompletion.choices[0].message.content);

      // Process response (similar to getMealPlan)
      const jsonMatch =
        chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON found in AI response");

      const generatedDay = JSON.parse(jsonMatch[0]);
      if (!generatedDay.meals || !Array.isArray(generatedDay.meals)) {
        throw new Error("AI response does not match the expected structure");
      }

      // Delete existing meals for this day
      await pool.query(
        `DELETE FROM meal_plan_meal 
       WHERE meal_plan_id = $1 AND day_number = $2
       RETURNING meal_id`,
        [mealPlanId, dayNumber]
      );

      // Save new meals
      for (const meal of generatedDay.meals) {
        const mealResult = await pool.query(
          `INSERT INTO meal (name, description, calories, protein, carbs, fats) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [
            meal.name,
            meal.description,
            meal.calories,
            meal.protein,
            meal.carbs,
            meal.fats,
          ]
        );

        await pool.query(
          `INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES ($1, $2, $3, $4, $5)`,
          [
            mealPlanId,
            mealResult.rows[0].id,
            dayNumber,
            meal.meal_order,
            meal.time,
          ]
        );
      }

      return res.status(200).json(generatedDay);
    } catch (error) {
      retryCount++;
      console.error(`Attempt ${retryCount} failed:`, error.message);

      if (retryCount >= MAX_RETRIES) {
        console.error("Max retries reached, giving up");
        return res.status(500).json({
          error: "Failed to generate day meal plan",
          details: error.message,
        });
      }
    }
  }
};

// Replace a meal with a favorite
const replaceMealWithFavorite = async (req, res) => {
  const { userId } = req.body;
  const { mealPlanMealId, favoriteMealId } = req.body;
  console.log(
    "userId: ",
    userId,
    "mealPlanMealId: ",
    mealPlanMealId,
    "favoriteMealId: ",
    favoriteMealId
  );

  try {
    // Verify the favorite meal exists and belongs to the user
    const favoriteCheck = await pool.query(
      `SELECT m.* FROM user_favorite_meals ufm
       JOIN meal m ON ufm.meal_id = m.id
       WHERE ufm.user_id = $1 AND m.id = $2`,
      [userId, favoriteMealId]
    );

    if (favoriteCheck.rows.length === 0) {
      return res.status(404).json({ message: "Favorite meal not found" });
    }

    const favoriteMeal = favoriteCheck.rows[0];

    // Get the meal plan meal to replace
    const mealPlanMeal = await pool.query(
      `SELECT * FROM meal_plan_meal WHERE id = $1`,
      [mealPlanMealId]
    );

    if (mealPlanMeal.rows.length === 0) {
      return res.status(404).json({ message: "Meal plan meal not found" });
    }

    // Update the meal_plan_meal to point to the favorite meal
    await pool.query(`UPDATE meal_plan_meal SET meal_id = $1 WHERE id = $2`, [
      favoriteMealId,
      mealPlanMealId,
    ]);

    res.json({
      message: "Meal replaced with favorite successfully",
      newMeal: favoriteMeal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Regenerate a specific meal
const regenerateMeal = async (req, res) => {
  const { userId, mealPlanMealId } = req.body;
  const MAX_RETRIES = 3;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      let personalizationData;
      let useDefaultPlan = false;

      // Get the meal plan meal to regenerate
      const mealPlanMeal = await pool.query(
        `SELECT mpm.*, m.name, m.description, m.calories, m.protein, m.carbs, m.fats
       FROM meal_plan_meal mpm
       JOIN meal m ON mpm.meal_id = m.id
       WHERE mpm.id = $1`,
        [mealPlanMealId]
      );

      if (mealPlanMeal.rows.length === 0) {
        return res.status(404).json({ message: "Meal plan meal not found" });
      }

      const currentMeal = mealPlanMeal.rows[0];

      try {
        // Fetch both personalization data and ingredients in parallel
        [personalizationData, ingredients] = await Promise.all([
          pool.query(
            `SELECT steps_data FROM personalization WHERE user_id = $1`,
            [userId]
          ),
          getInStockUserIngredients(userId),
        ]);
        console.log("ingredients given to AI: ", ingredients);

        if (personalizationData.rows.length === 0) {
          useDefaultPlan = true;
        }
      } catch (dbError) {
        console.error("Error fetching personalization data:", dbError);
        useDefaultPlan = true;
      }

      let SYSTEM_PROMPT;
      let userProfile;
      let JSON_structure = `The JSON structure should match this format:
    {
      "meal": {
        "name": "Meal Name",
        "description": "Meal Description",
        "calories": 500,
        "protein": 30,
        "carbs": 50,
        "fats": 20
      }
    }`;

      if (useDefaultPlan) {
        SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a single healthy meal replacement in valid JSON format. 
        The meal should be balanced and suitable for an average adult with no specific health concerns.
        The meal should have a name, description, calories, protein, carbs, and fats.

    Strict Requirements:
    - Calories should be within ±10% of ${currentMeal.calories} (target: ${
          currentMeal.calories
        })
    - Protein should be within ±5g of ${currentMeal.protein}g (target: ${
          currentMeal.protein
        }g)
    - Carbs should be within ±10g of ${currentMeal.carbs}g (target: ${
          currentMeal.carbs
        }g)
    - Fats should be within ±5g of ${currentMeal.fats}g (target: ${
          currentMeal.fats
        }g)
    - Take into account the meal Time (${
      currentMeal.time
    }) and the meal number of the day (${currentMeal.meal_order})
    - Use integers for the macros and calories
    - The meal should have a specific name that clearly describes the main ingredients (e.g., "Grilled Shrimp & Veggies")

        ${JSON_structure}

        Make sure the response is valid JSON and does not include any additional text or explanations.`;

        userProfile =
          "User has no personalization data. Generate a default healthy exercise plan.";
      } else {
        const { steps_data } = personalizationData.rows[0];
        const personalInfo = steps_data.step_1?.personalInfo || {};
        const fitnessGoal = steps_data.step_2?.fitnessGoal || {};
        const weightGoal = steps_data.step_2?.weightGoal || {};
        const cuisinePreferences = steps_data.step_3?.cuisinePreferences || [];
        const dietPreference = steps_data.step_3?.dietPreference || "none";
        const healthIssues = steps_data.step_3?.healthIssues || ["none"];
        const mealsPerDay = steps_data.step_3?.mealsPerDay || 3;
        const activityLevel = steps_data.step_4?.activityLevel || "moderate";
        const budget = steps_data.step_5?.budget || "basic";

        const ingredientsList = ingredients
          .map((ing) => `${ing.ingredient_name} (${ing.ingredient_category})`)
          .join(", ");

        userProfile = `
      User Profile:
      - Age: ${personalInfo.age}
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} cm
      - Weight: ${personalInfo.weight} kg
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} kg in ${
          weightGoal.timeframe
        } weeks
      - Cuisine Preferences: ${cuisinePreferences.join(", ")}
      - Diet Preference: ${dietPreference}
      - Health Issues: ${healthIssues.join(", ")}
      - Meals Per Day: ${mealsPerDay}
      - Activity Level: ${activityLevel}
      - Budget: ${budget}
      - Available Ingredients: ${ingredientsList}
    `;

        // Create prompt specifically for regenerating one meal
        SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a single meal replacement in valid JSON format based on the user's profile and available ingredients. 
    The meal should have a name, description, calories, protein, carbs, and fats. Consider the user's dietary restrictions, preferences, 
    goals, and available ingredients.

    Strict Requirements:
    - Calories should be within ±10% of ${currentMeal.calories} (target: ${
          currentMeal.calories
        })
    - Protein should be within ±5g of ${currentMeal.protein}g (target: ${
          currentMeal.protein
        }g)
    - Carbs should be within ±10g of ${currentMeal.carbs}g (target: ${
          currentMeal.carbs
        }g)
    - Fats should be within ±5g of ${currentMeal.fats}g (target: ${
          currentMeal.fats
        }g)
    - Take into account the meal Time (${
      currentMeal.time
    }) and the meal number of the day (${currentMeal.meal_order})
    - Use integers for the macros and calories
    - The meal should have a specific name that clearly describes the main ingredients (e.g., "Grilled Shrimp & Veggies")

    Additional Requirements:
    - Strictly follow dietary restrictions: ${dietPreference}
    - Avoid ingredients that might affect these health issues: ${healthIssues.join(
      ", "
    )}
    - Prioritize these cuisines: ${cuisinePreferences.join(", ")}
    - Budget level: ${budget}
    - Prioritize using these available ingredients: ${ingredientsList}
    - Only include meals that can be made with available ingredients or common pantry staples (salt, pepper, basic spices)
    - If no suitable meals can be made with available ingredients, suggest simple meals that require minimal additional ingredients

    ${JSON_structure}

    Make sure the response is valid JSON and does not include any additional text or explanations.`;
      }
      // Call Groq API
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userProfile },
        ],
        model: "llama3-70b-8192",
        temperature: 0.4,
        max_tokens: 1000,
        top_p: 0.95,
        stream: false,
      });

      console.log("AI Response:", chatCompletion.choices[0].message.content);

      // Process response
      const jsonMatch =
        chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON found in AI response");

      const generatedMeal = JSON.parse(jsonMatch[0]);
      if (!generatedMeal.meal) {
        throw new Error("AI response does not match the expected structure");
      }
      console.log("generated meal: ", generatedMeal);

      // Create new meal
      const mealResult = await pool.query(
        `INSERT INTO meal (name, description, calories, protein, carbs, fats) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          generatedMeal.meal.name,
          generatedMeal.meal.description,
          generatedMeal.meal.calories,
          generatedMeal.meal.protein,
          generatedMeal.meal.carbs,
          generatedMeal.meal.fats,
        ]
      );

      // Update meal_plan_meal to point to the new meal
      await pool.query(`UPDATE meal_plan_meal SET meal_id = $1 WHERE id = $2`, [
        mealResult.rows[0].id,
        mealPlanMealId,
      ]);

      return res.status(200).json(generatedMeal);
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

const createDefaultMealPlan = async (userId) => {
  const defaultMealPlan = {
    meal_plan: {
      name: "Healthy Starter Meal Plan",
      description:
        "A balanced 7-day meal plan for general health and wellness, totaling around 2000 calories per day",
    },
    meals: [
      // Monday
      {
        name: "Oatmeal with Berries",
        description:
          "Whole grain oats with mixed berries, almond butter, and flaxseeds",
        calories: 400,
        protein: 14,
        carbs: 60,
        fats: 14,
        time: "08:00",
        day_number: 1,
        meal_order: 1,
      },
      {
        name: "Grilled Chicken Salad",
        description:
          "Mixed greens with grilled chicken, chickpeas, olive oil and quinoa",
        calories: 500,
        protein: 38,
        carbs: 30,
        fats: 28,
        time: "12:30",
        day_number: 1,
        meal_order: 2,
      },
      {
        name: "Baked Salmon with Quinoa",
        description: "Baked salmon, quinoa, roasted vegetables, and olive oil",
        calories: 600,
        protein: 40,
        carbs: 35,
        fats: 35,
        time: "19:00",
        day_number: 1,
        meal_order: 3,
      },

      // Tuesday
      {
        name: "Greek Yogurt with Banana",
        description: "Greek yogurt, banana, almonds, and granola",
        calories: 350,
        protein: 18,
        carbs: 40,
        fats: 14,
        time: "08:00",
        day_number: 2,
        meal_order: 1,
      },
      {
        name: "Turkey Wrap",
        description: "Whole wheat wrap with turkey, lettuce, tomato, hummus",
        calories: 480,
        protein: 30,
        carbs: 35,
        fats: 24,
        time: "12:30",
        day_number: 2,
        meal_order: 2,
      },
      {
        name: "Stir-Fried Tofu and Veggies",
        description: "Tofu, broccoli, bell peppers, brown rice, sesame oil",
        calories: 550,
        protein: 30,
        carbs: 50,
        fats: 28,
        time: "19:00",
        day_number: 2,
        meal_order: 3,
      },

      // Wednesday
      {
        name: "Smoothie Bowl",
        description:
          "Banana, spinach, peanut butter, protein powder, almond milk",
        calories: 400,
        protein: 25,
        carbs: 35,
        fats: 18,
        time: "08:00",
        day_number: 3,
        meal_order: 1,
      },
      {
        name: "Quinoa Chickpea Bowl",
        description: "Quinoa, chickpeas, roasted veggies, tahini dressing",
        calories: 500,
        protein: 22,
        carbs: 45,
        fats: 24,
        time: "12:30",
        day_number: 3,
        meal_order: 2,
      },
      {
        name: "Grilled Shrimp & Veggies",
        description: "Shrimp, olive oil sautéed zucchini, carrots, brown rice",
        calories: 580,
        protein: 35,
        carbs: 40,
        fats: 28,
        time: "19:00",
        day_number: 3,
        meal_order: 3,
      },

      // Thursday
      {
        name: "Scrambled Eggs with Toast",
        description: "Scrambled eggs, whole grain toast, avocado slices",
        calories: 450,
        protein: 20,
        carbs: 30,
        fats: 26,
        time: "08:00",
        day_number: 4,
        meal_order: 1,
      },
      {
        name: "Lentil Soup with Bread",
        description: "Lentil soup with whole grain bread and mixed greens",
        calories: 450,
        protein: 22,
        carbs: 40,
        fats: 18,
        time: "12:30",
        day_number: 4,
        meal_order: 2,
      },
      {
        name: "Grilled Chicken & Sweet Potato",
        description:
          "Grilled chicken breast, roasted sweet potatoes, green beans",
        calories: 600,
        protein: 42,
        carbs: 45,
        fats: 26,
        time: "19:00",
        day_number: 4,
        meal_order: 3,
      },

      // Friday
      {
        name: "Chia Pudding with Kiwi",
        description: "Chia seeds soaked in almond milk, kiwi, walnuts",
        calories: 380,
        protein: 14,
        carbs: 25,
        fats: 22,
        time: "08:00",
        day_number: 5,
        meal_order: 1,
      },
      {
        name: "Grilled Veggie Sandwich",
        description: "Whole grain bread, grilled vegetables, cheese, fruit",
        calories: 470,
        protein: 18,
        carbs: 40,
        fats: 25,
        time: "12:30",
        day_number: 5,
        meal_order: 2,
      },
      {
        name: "Turkey Meatballs & Spaghetti Squash",
        description: "Lean turkey meatballs, spaghetti squash, marinara",
        calories: 550,
        protein: 36,
        carbs: 35,
        fats: 28,
        time: "19:00",
        day_number: 5,
        meal_order: 3,
      },

      // Saturday
      {
        name: "Protein Pancakes",
        description:
          "Protein pancakes topped with Greek yogurt and almond butter",
        calories: 450,
        protein: 25,
        carbs: 40,
        fats: 22,
        time: "08:00",
        day_number: 6,
        meal_order: 1,
      },
      {
        name: "Tuna Salad with Quinoa",
        description: "Tuna salad, greens, avocado, quinoa",
        calories: 500,
        protein: 32,
        carbs: 30,
        fats: 28,
        time: "12:30",
        day_number: 6,
        meal_order: 2,
      },
      {
        name: "Stuffed Bell Peppers",
        description:
          "Lean ground beef, rice, tomato sauce, bell peppers, olive oil",
        calories: 580,
        protein: 36,
        carbs: 40,
        fats: 30,
        time: "19:00",
        day_number: 6,
        meal_order: 3,
      },

      // Sunday
      {
        name: "Avocado Toast with Egg",
        description: "Whole grain toast, mashed avocado, 2 eggs, hemp seeds",
        calories: 450,
        protein: 20,
        carbs: 30,
        fats: 25,
        time: "08:00",
        day_number: 7,
        meal_order: 1,
      },
      {
        name: "Couscous Salad with Feta",
        description: "Couscous, cucumber, tomato, olives, feta, olive oil",
        calories: 500,
        protein: 18,
        carbs: 35,
        fats: 28,
        time: "12:30",
        day_number: 7,
        meal_order: 2,
      },
      {
        name: "Baked Cod with Roasted Potatoes",
        description: "Cod fillet, roasted potatoes, asparagus, olive oil",
        calories: 550,
        protein: 38,
        carbs: 40,
        fats: 24,
        time: "19:00",
        day_number: 7,
        meal_order: 3,
      },
    ],
  };

  await saveAndAdoptMealPlan(
    {
      body: { userId, plan: defaultMealPlan },
    },
    {
      status: () => ({ json: () => {} }),
    }
  );
};

// Don't forget to export the new functions at the bottom of the file:
module.exports = {
  getAdoptedMealPlanByUser,
  getAllMealPlansByUser,
  getTodaysMealsByUser,
  getMealPlan,
  saveMealPlan,
  saveAndAdoptMealPlan,
  adoptMealPlan,
  getFavoriteMeals,
  addFavoriteMeal,
  removeFavoriteMeal,
  regenerateDay,
  regenerateMeal,
  replaceMealWithFavorite,
  removeSavedPlan,
  createDefaultMealPlan,
};
