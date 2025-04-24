const pool = require('../db');
const { HfInference } = require('@huggingface/inference'); // Import Hugging Face Inference
const Groq = require("groq-sdk");
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

// API: deepseek-r1-distill-llama-70b using Groq
const getMealPlan = async (req, res) => {
  try {
    // Define the system prompt to guide the AI
    const SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a 7-day meal plan in valid JSON format. The plan should include meals for breakfast, lunch, and dinner each day. Each meal should have a name, description, calories, protein, carbs, fats, and time. The JSON structure should match this format:
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
    Make sure the response is valid JSON and does not include any additional text or explanations.`;

    // Make the request to Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT }, // System prompt to guide the AI
        { role: "user", content: "Generate a 7-day meal plan in JSON format." }, // User prompt
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
      !generatedPlan.meal_plan ||
      !generatedPlan.meals ||
      !Array.isArray(generatedPlan.meals)
    ) {
      throw new Error("AI response does not match the expected structure");
    }

    // Send the generated plan back to the frontend
    res.status(200).json(generatedPlan);
  } catch (error) {
    console.error("Error generating meal plan:", error);
    res.status(500).json({ error: "Failed to generate meal plan" });
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
        `INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, time) VALUES ($1, $2, $3, $4)`,
        [mealPlanId, mealId, meal.day_number, meal.time]
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
        `INSERT INTO meal_plan_meal (meal_plan_id, meal_id, day_number, time) VALUES ($1, $2, $3, $4)`,
        [mealPlanId, mealId, meal.day_number, meal.time]
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
// API: deepseek/deepseek-chat:free using Openrouter

// const getMealPlan = async (req, res) => {
//   try {
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "HTTP-Referer": "x",
//         "X-Title": "x",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "deepseek/deepseek-chat:free",
//         messages: [
//           {
//             role: "user",
//             content: `Generate a 7-day meal plan in valid JSON format. The plan should include meals for breakfast, lunch, and dinner each day. Each meal should have a name, description, calories, protein, carbs, fats, and time. The JSON structure should match this format:
//             {
//               "meal_plan": {
//                 "name": "7-Day Meal Plan",
//                 "description": "A balanced meal plan for a week."
//               },
//               "meals": [
//                 {
//                   "name": "Meal Name",
//                   "description": "Meal Description",
//                   "calories": 500,
//                   "protein": 30,
//                   "carbs": 50,
//                   "fats": 20,
//                   "time": "08:00",
//                   "day_number": 1
//                 }
//               ]
//             }
//             Make sure the response is valid JSON and does not include any additional text or explanations.`,
//           },
//         ],
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log("AI Response:", data.choices[0].message.content); // Log the response for debugging

//     // Extract JSON from the response using a regular expression
//     const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//       throw new Error("No valid JSON found in AI response");
//     }

//     // Parse the extracted JSON
//     let generatedPlan;
//     try {
//       generatedPlan = JSON.parse(jsonMatch[0]);
//     } catch (parseError) {
//       console.error("Failed to parse AI response as JSON:", parseError);
//       throw new Error("AI response is not valid JSON");
//     }

//     res.status(200).json(generatedPlan); // Send the generated plan back to the frontend
//   } catch (error) {
//     console.error("Error generating meal plan:", error);
//     res.status(500).json({ error: "Failed to generate meal plan" });
//   }
// };



// API: mistralai/Mixtral-8x7B-Instruct-v0.1 using Huggingface

// const getMealPlan = async (req, res) => {
//   try {
//     console.log(hf)
//     // Define the system prompt to guide the AI
//     const SYSTEM_PROMPT = `You are a helpful nutritionist. Generate a 7-day meal plan in valid JSON format. The plan should include meals for breakfast, lunch, and dinner each day. Each meal should have a name, description, calories, protein, carbs, fats, and time. The JSON structure should match this format:
//     {
//       "meal_plan": {
//         "name": "7-Day Meal Plan",
//         "description": "A balanced meal plan."
//       },
//       "meals": [
//         {
//           "name": "Meal Name",
//           "description": "Meal Description",
//           "calories": 500,
//           "protein": 30,
//           "carbs": 50,
//           "fats": 20,
//           "time": "08:00",
//           "day_number": 1
//         }
//       ]
//     }
//     Make sure the response is valid JSON and does not include any additional text or explanations.`;

//     // Make the request to Hugging Face
//     const response = await hf.chatCompletion({
//       model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Use the desired model
//       messages: [
//         { role: "system", content: SYSTEM_PROMPT }, // System prompt to guide the AI
//         { role: "user", content: "Generate a 3-day meal plan in JSON format." }, // User prompt
//       ],
//       max_tokens: 4000, // Adjust based on your needs
//     });

//     // Log the response for debugging
//     console.log("AI Response:", response.choices[0].message.content);

//     // Extract JSON from the response using a regular expression
//     const jsonMatch = response.choices[0].message.content.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//       throw new Error("No valid JSON found in AI response");
//     }

//     // Parse the extracted JSON
//     let generatedPlan;
//     try {
//       generatedPlan = JSON.parse(jsonMatch[0]);
//     } catch (parseError) {
//       console.error("Failed to parse AI response as JSON:", parseError);
//       throw new Error("AI response is not valid JSON");
//     }

//     // Validate the structure of the generated plan
//     if (
//       !generatedPlan.meal_plan ||
//       !generatedPlan.meals ||
//       !Array.isArray(generatedPlan.meals)
//     ) {
//       throw new Error("AI response does not match the expected structure");
//     }

//     // Send the generated plan back to the frontend
//     res.status(200).json(generatedPlan);
//   } catch (error) {
//     console.error("Error generating meal plan:", error);
//     res.status(500).json({ error: "Failed to generate meal plan" });
//   }
// };

module.exports = { saveAndAdoptMealPlan, getAdoptedMealPlanByUser, getAllMealPlansByUser, getMealPlan, saveMealPlan, adoptMealPlan };
