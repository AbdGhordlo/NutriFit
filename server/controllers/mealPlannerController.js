const pool = require('../db');
const { HfInference } = require('@huggingface/inference'); // Import Hugging Face Inference
const Groq = require("groq-sdk");
const { getInStockUserIngredients } = require('./ingredientsController');
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
      return res.status(404).json({ message: "No adopted meal plan found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
      return res.status(404).json({ message: "No meal plans found for this user." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getMealPlan = async (req, res) => {
    const { userId } = req.params;
    const MAX_RETRIES = 3; // Maximum number of retries if JSON parsing fails
    let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      // Fetch both personalization data and ingredients in parallel
      const [personalizationData, ingredients] = await Promise.all([
        pool.query(`SELECT steps_data FROM personalization WHERE user_id = $1`, [userId]),
        getInStockUserIngredients(userId)
      ]);
      console.log("ingredients given to AI: ",ingredients);

      if (personalizationData.rows.length === 0) {
        return res.status(404).json({ error: "Personalization data not found" });
      }

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
      const ingredientsList = ingredients.map(ing => 
        `${ing.ingredient_name} (${ing.ingredient_category})`
      ).join(", ");

    // Create a detailed user profile for the prompt
    const userProfile = `
      User Profile:
      - Age: ${personalInfo.age}
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} cm
      - Weight: ${personalInfo.weight} kgs
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} kgs in ${weightGoal.timeframe} weeks
      - Cuisine Preferences: ${cuisinePreferences.join(", ")}
      - Diet Preference: ${dietPreference}
      - Health Issues: ${healthIssues.join(", ")}
      - Activity Level: ${activityLevel}
      - Budget: ${budget}
      - Available Ingredients: ${ingredientsList}
      `;
      // - Meals Per Day: ${mealsPerDay} I removed this temporarily
      
    // Define the system prompt with personalization
    //     const SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a personalized 7-day meal plan in valid JSON format based on the user's 
    //     profile and available ingredients. The plan should include meals for breakfast, lunch, and dinner each day, or more meals if specified. 
    //     Each meal should have a name, description, calories, protein, carbs, fats, and time. Consider the user's dietary restrictions, preferences, 
    //     goals, and available ingredients.

    // Requirements:
    // - Generate exactly ${mealsPerDay} meals for this day
    // - Strictly follow dietary restrictions: ${dietPreference}
    // - Avoid ingredients that might affect these health issues: ${healthIssues.join(", ")}
    // - Prioritize these cuisines: ${cuisinePreferences.join(", ")}
    // - Budget level: ${budget}
    // - Target calories based on user's weight goal and activity level
    // - Make sure the total calories in a single day meet the Target Calories
    // - Prioritize using these available ingredients: ${ingredientsList}
    // - Only include meals that can be made with available ingredients or common pantry staples (salt, pepper, basic spices)
    // - If no suitable meals can be made with available ingredients, suggest simple meals that require minimal additional ingredients

    // The JSON structure should match this format:
    // {
    //   "meal_plan": {
    //     "name": "7-Day Personalized Meal Plan",
    //     "description": "A balanced meal plan tailored to the user's needs."
    //   },
    //   "meals": [
    //     {
    //       "name": "Meal Name",
    //       "description": "Meal Description",
    //       "calories": 500,
    //       "protein": 30,
    //       "carbs": 50,
    //       "fats": 20,
    //       "time": "08:00",
    //       "day_number": 1,
    //       "meal_order": 1
    //     }
    //   ]
    // }
    // Make sure the response is valid JSON and does not include any additional text or explanations.
    // And make sure you generate the full plan, not just one day.`;
   // Enhanced prompt with strict JSON formatting requirements
      const SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a personalized 7-day meal plan in valid JSON format based on the user's profile and available ingredients. 

      IMPORTANT INSTRUCTIONS:
      1. Return ONLY valid JSON with no additional text before or after
      2. Ensure all strings are properly quoted with double quotes
      3. Ensure all brackets and braces are properly closed
      4. Include all required fields for each meal
      5. Maintain consistent structure throughout

      Requirements:
      - Generate exactly ${mealsPerDay} meals per day for 7 days (total ${mealsPerDay * 7} meals)
      - Ensure each meal has: name, description, calories, protein, carbs, fats, time, day_number, and meal_order
      - Strictly follow dietary restrictions: ${dietPreference}
      - Avoid ingredients that might affect these health issues: ${healthIssues.join(", ")}
      - Prioritize these cuisines: ${cuisinePreferences.join(", ")}
      - Budget level: ${budget}
      - Target calories based on user's weight goal and activity level
      - Prioritize using these available ingredients: ${ingredientsList}
      - Ensure good variety between days (don't repeat the same meals every day)
      - For meal_order: 1=breakfast, 2=lunch, 3=dinner, 4+=snacks

      Example of proper JSON structure:
      {
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
      }
        Make sure the response is valid JSON and does not include any additional text or explanations.
    And make sure you generate the full plan, not just one day.`;

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
          details: error.message 
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
        [meal.name, meal.description, meal.calories, meal.protein, meal.carbs, meal.fats]
      );

      const mealId = mealResult.rows[0].id;

      await pool.query(
        `INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES ($1, $2, $3, $4, $5)`,
        [mealPlanId, mealId, meal.day_number, meal.meal_order, meal.time]
      );
    }

    res.status(200).json({ message: "Meal plan saved successfully!", mealPlanId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
        [meal.name, meal.description, meal.calories, meal.protein, meal.carbs, meal.fats]
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

    res.status(200).json({ message: "Meal plan saved and adopted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
    res.status(500).send('Server error');
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
      return res.status(404).json({ message: "Meal plan not found or doesn't belong to user" });
    }

    // Check if this is the adopted plan
    const adoptedCheck = await pool.query(
      `SELECT is_adopted_plan FROM meal_plan 
       WHERE id = $1`,
      [planId]
    );

    if (adoptedCheck.rows[0].is_adopted_plan) {
      return res.status(400).json({ message: "Cannot remove currently adopted plan" });
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
      removedPlan: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Server error",
      details: err.message 
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
        m.fats
      FROM user_favorite_meals ufm
      JOIN meal m ON ufm.meal_id = m.id
      WHERE ufm.user_id = $1
      ORDER BY ufm.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Add meal to favorites
const addFavoriteMeal = async (req, res) => {
  const { userId } = req.params;
  const { mealId } = req.body;

  try {
    // First check if the meal exists
    const mealCheck = await pool.query(
      `SELECT id FROM meal WHERE id = $1`,
      [mealId]
    );

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
    res.status(500).send('Server error');
  }
};

// Remove meal from favorites
const removeFavoriteMeal = async (req, res) => {
  const { userId, mealId } = req.params;

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
      removedMeal: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Server error",
      details: err.message 
    });
  }
};

// Regenerate a specific day's meals
const regenerateDay = async (req, res) => {
  const { userId, dayNumber } = req.params;

  try {
    const mealPlanId = await getAdoptedMealPlanIdByUser(userId);

    // Get user's personalization data and ingredients
    const [personalizationData, ingredients] = await Promise.all([
      pool.query(`SELECT steps_data FROM personalization WHERE user_id = $1`, [userId]),
      getInStockUserIngredients(userId)
    ]);

    if (personalizationData.rows.length === 0) {
      return res.status(404).json({ error: "Personalization data not found" });
    }

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
    const ingredientsList = ingredients.map(ing => 
      `${ing.ingredient_name} (${ing.ingredient_category})`
    ).join(", ");

    // Create a detailed user profile for the prompt
    const userProfile = `
      User Profile:
      - Age: ${personalInfo.age}
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} inches
      - Weight: ${personalInfo.weight} lbs
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} lbs in ${weightGoal.timeframe} weeks
      - Cuisine Preferences: ${cuisinePreferences.join(", ")}
      - Diet Preference: ${dietPreference}
      - Health Issues: ${healthIssues.join(", ")}
      - Meals Per Day: ${mealsPerDay}
      - Activity Level: ${activityLevel}
      - Budget: ${budget}
      - Available Ingredients: ${ingredientsList}
    `;

    // Create prompt specifically for regenerating one day
    const SYSTEM_PROMPT = `You are a helpful nutritionist. Generate meals for a single day (day ${dayNumber}) of a meal plan in valid JSON format based on the user's
    profile and available ingredients. The plan should include meals for breakfast, lunch, and dinner each day, or more meals if specified. 
    Each meal should have a name, description, calories, protein, carbs, fats, and time. Consider the user's dietary restrictions, preferences, 
    goals, and available ingredients.
    
    Requirements:
    - Generate exactly ${mealsPerDay} meals for this day
    - Maintain the same meal order as the original plan
    - Strictly follow dietary restrictions: ${dietPreference}
    - Avoid ingredients that might affect these health issues: ${healthIssues.join(", ")}
    - Prioritize these cuisines: ${cuisinePreferences.join(", ")}
    - Budget level: ${budget}
    - Target calories based on user's weight goal and activity level
    - Make sure the total calories in a single day meet the Target Calories
    - Prioritize using these available ingredients: ${ingredientsList}
    - Only include meals that can be made with available ingredients or common pantry staples (salt, pepper, basic spices)
    - If no suitable meals can be made with available ingredients, suggest simple meals that require minimal additional ingredients
    
    The JSON structure should match this format:
    {
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
    }
    Make sure the response is valid JSON and does not include any additional text or explanations.`;

    // Call Groq API (similar to getMealPlan)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userProfile },
      ],
      model: "llama3-70b-8192",
      temperature: 0.4,
      max_tokens: 5000,
      top_p: 0.95,
      stream: false,
    });

    console.log("AI Response:", chatCompletion.choices[0].message.content);

    // Process response (similar to getMealPlan)
    const jsonMatch = chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
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
        [meal.name, meal.description, meal.calories, meal.protein, meal.carbs, meal.fats]
      );

      await pool.query(
        `INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, meal_order, time) VALUES ($1, $2, $3, $4, $5)`,
        [mealPlanId, mealResult.rows[0].id, dayNumber, meal.meal_order, meal.time]
      );
    }

    res.status(200).json({ message: "Day regenerated successfully", meals: generatedDay.meals });
  } catch (error) {
    console.error("Error regenerating day:", error);
    res.status(500).json({ error: "Failed to regenerate day" });
  }
};

// Replace a meal with a favorite
const replaceMealWithFavorite = async (req, res) => {
  const { userId } = req.params;
  const { mealPlanMealId, favoriteMealId } = req.body;
  console.log("userId: ",userId, "mealPlanMealId: ",mealPlanMealId, "favoriteMealId: ",favoriteMealId);

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
    await pool.query(
      `UPDATE meal_plan_meal SET meal_id = $1 WHERE id = $2`,
      [favoriteMealId, mealPlanMealId]
    );

    res.json({ 
      message: "Meal replaced with favorite successfully",
      newMeal: favoriteMeal
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Regenerate a specific meal
const regenerateMeal = async (req, res) => {
  const { userId, mealPlanMealId } = req.params;

  try {
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

    // Get user's personalization data and ingredients
    const [personalizationData, ingredients] = await Promise.all([
      pool.query(`SELECT steps_data FROM personalization WHERE user_id = $1`, [userId]),
      getInStockUserIngredients(userId)
    ]);

    if (personalizationData.rows.length === 0) {
      return res.status(404).json({ error: "Personalization data not found" });
    }

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
    const ingredientsList = ingredients.map(ing => 
      `${ing.ingredient_name} (${ing.ingredient_category})`
    ).join(", ");

    // Create a detailed user profile for the prompt
    const userProfile = `
      User Profile:
      - Age: ${personalInfo.age}
      - Gender: ${personalInfo.gender}
      - Height: ${personalInfo.height} inches
      - Weight: ${personalInfo.weight} lbs
      - Fitness Goal: ${fitnessGoal.type}
      - Weight Goal: ${weightGoal.targetWeight} lbs in ${weightGoal.timeframe} weeks
      - Cuisine Preferences: ${cuisinePreferences.join(", ")}
      - Diet Preference: ${dietPreference}
      - Health Issues: ${healthIssues.join(", ")}
      - Meals Per Day: ${mealsPerDay}
      - Activity Level: ${activityLevel}
      - Budget: ${budget}
      - Available Ingredients: ${ingredientsList}
    `;

    // Create prompt specifically for regenerating one meal
    const SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a single meal replacement in valid JSON format based on the user's profile and available ingredients. 
    The meal should have a name, description, calories, protein, carbs, fats, and time. Consider the user's dietary restrictions, preferences, 
    goals, and available ingredients.

    Strict Requirements:
    - Calories should be within ±10% of ${currentMeal.calories} (target: ${currentMeal.calories})
    - Protein should be within ±5g of ${currentMeal.protein}g (target: ${currentMeal.protein}g)
    - Carbs should be within ±10g of ${currentMeal.carbs}g (target: ${currentMeal.carbs}g)
    - Fats should be within ±5g of ${currentMeal.fats}g (target: ${currentMeal.fats}g)
    - Take into account the meal Time (${currentMeal.time}) and the meal number of the day (${currentMeal.meal_order})
    - Use integers for the macros and calories

    Additional Requirements:
    - Strictly follow dietary restrictions: ${dietPreference}
    - Avoid ingredients that might affect these health issues: ${healthIssues.join(", ")}
    - Prioritize these cuisines: ${cuisinePreferences.join(", ")}
    - Budget level: ${budget}
    - Prioritize using these available ingredients: ${ingredientsList}
    - Only include meals that can be made with available ingredients or common pantry staples (salt, pepper, basic spices)
    - If no suitable meals can be made with available ingredients, suggest simple meals that require minimal additional ingredients

    The JSON structure should match this format:
    {
      "meal": {
        "name": "Meal Name",
        "description": "Meal Description",
        "calories": 500,
        "protein": 30,
        "carbs": 50,
        "fats": 20
      }
    }
    Make sure the response is valid JSON and does not include any additional text or explanations.`;

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
    const jsonMatch = chatCompletion.choices[0].message.content.match(/\{[\s\S]*\}/);
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
        generatedMeal.meal.fats
      ]
    );

    // Update meal_plan_meal to point to the new meal
    await pool.query(
      `UPDATE meal_plan_meal SET meal_id = $1 WHERE id = $2`,
      [mealResult.rows[0].id, mealPlanMealId]
    );

    res.status(200).json({ 
      message: "Meal regenerated successfully",
      meal: generatedMeal.meal
    });
  } catch (error) {
    console.error("Error regenerating meal:", error);
    res.status(500).json({ error: "Failed to regenerate meal" });
  }
};

// Don't forget to export the new functions at the bottom of the file:
module.exports = {
  getAdoptedMealPlanByUser,
  getAllMealPlansByUser,
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
  removeSavedPlan
};
