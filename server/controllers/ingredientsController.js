const pool = require("../db");

// Get user ingredients (grouped by category)
const getUserIngredients = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        i.id AS ingredient_id,
        SPLIT_PART(i.name, '_', 1) AS ingredient_name, -- Extract original name before '_'
        i.category AS ingredient_category,
        i.calories AS ingredient_calories,
        i.protein AS ingredient_protein,
        i.carbs AS ingredient_carbs,
        i.fats AS ingredient_fats,
        i.serving_size AS ingredient_serving_size,
        ui.in_stock AS in_stock,
        ui.id AS user_ingredient_id
      FROM user_ingredients ui
      JOIN ingredient i ON ui.ingredient_id = i.id
      WHERE ui.user_id = $1
      ORDER BY i.category, SPLIT_PART(i.name, '_', 1);`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const getInStockUserIngredients = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT 
        i.id AS ingredient_id,
        i.name AS ingredient_name,
        i.category AS ingredient_category,
        i.calories AS ingredient_calories,
        i.protein AS ingredient_protein,
        i.carbs AS ingredient_carbs,
        i.fats AS ingredient_fats
      FROM user_ingredients ui
      JOIN user_ingredient_ingredient uii ON ui.id = uii.user_ingredients_id
      JOIN ingredient i ON uii.ingredient_id = i.id
      WHERE ui.user_id = $1 AND ui.in_stock = true
      ORDER BY i.category, i.name`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err; // Throw error to be handled by the calling function
  }
};

const toggleIngredientStock = async (req, res) => {
  const { userIngredientId } = req.params;
  const { in_stock } = req.body;

  try {
    const result = await pool.query(
      `UPDATE user_ingredients
       SET in_stock = $1
       WHERE id = $2
       RETURNING *`,
      [in_stock, userIngredientId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User ingredient not found" });
    }

    res.json({
      user_ingredient_id: parseInt(userIngredientId),
      in_stock: result.rows[0].in_stock,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const addIngredient = async (req, res) => {
  console.log("=== ADD INGREDIENT DEBUG ===");
  console.log("Request body:", req.body);

  const {
    userId,
    name,
    category,
    calories,
    protein,
    carbs,
    fats,
    servingSize: serving_size,
  } = req.body;

  console.log("Parsed values:", {
    userId,
    name,
    category,
    calories,
    protein,
    carbs,
    fats,
    serving_size,
  });

  // Validation
  if (!name || !category) {
    console.log("Validation failed: missing name or category");
    return res.status(400).json({ error: "Name and category are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    console.log("Transaction started");

    // Check if this exact ingredient with same name, category AND nutritional values exists
    console.log("Checking for existing ingredient...");
    const existingIngredientResult = await client.query(
      `SELECT id FROM ingredient 
       WHERE name = $1 AND category = $2 AND calories = $3 AND protein = $4 AND carbs = $5 AND fats = $6 AND serving_size = $7`,
      [name, category, calories, protein, carbs, fats, serving_size]
    );

    console.log(
      "Existing ingredient check result:",
      existingIngredientResult.rows
    );

    let ingredientId;

    if (existingIngredientResult.rows.length > 0) {
      console.log("Found existing ingredient with same nutritional values");
      // This exact ingredient with same nutritional values already exists
      ingredientId = existingIngredientResult.rows[0].id;

      // Check if the user already has this ingredient
      console.log("Checking if user already has this ingredient...");
      const alreadyLinkedResult = await client.query(
        `SELECT id FROM user_ingredients
         WHERE user_id = $1 AND ingredient_id = $2`,
        [userId, ingredientId]
      );

      console.log("User ingredient check result:", alreadyLinkedResult.rows);

      if (alreadyLinkedResult.rows.length > 0) {
        console.log("User already has this ingredient");
        await client.query("ROLLBACK");
        return res
          .status(409)
          .json({ error: "This ingredient is already added for the user." });
      }
    } else {
      console.log("No existing ingredient found, creating new one...");
      try {
        // No exact match found, insert new ingredient
        const insertIngredientResult = await client.query(
          `INSERT INTO ingredient (name, category, calories, protein, carbs, fats, serving_size)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id`,
          [name, category, calories, protein, carbs, fats, serving_size]
        );
        console.log("New ingredient created:", insertIngredientResult.rows);
        ingredientId = insertIngredientResult.rows[0].id;
      } catch (insertError) {
        console.error("Error inserting ingredient:", insertError);
        throw insertError;
      }
    }

    console.log("Creating user_ingredients entry...");
    // Create user_ingredients entry
    const insertUserIngredientResult = await client.query(
      `INSERT INTO user_ingredients (user_id, in_stock, ingredient_id)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [userId, true, ingredientId]
    );

    console.log("User ingredient created:", insertUserIngredientResult.rows);
    const userIngredientId = insertUserIngredientResult.rows[0].id;

    await client.query("COMMIT");
    console.log("Transaction committed successfully");

    res.status(201).json({
      message: "Ingredient added successfully",
      ingredient: {
        user_ingredient_id: userIngredientId,
        ingredient_id: ingredientId,
        name: name,
        category,
        calories,
        protein,
        carbs,
        fats,
        serving_size,
        in_stock: true,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("=== ERROR IN ADD INGREDIENT ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    res.status(500).json({ error: "Server error", details: error.message });
  } finally {
    client.release();
    console.log("Database connection released");
  }
};
const searchFood = async (query) => {
  const apiKey = "xOhA0U8ldEU349zVzOAiS9qJxvyU1VJGMcM6lYVW";
  if (!query) {
    throw new Error("Query parameter is required");
  }
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.foods;
};

const deleteIngredient = async (req, res) => {
  const { userIngredientId } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const deleteUserIngredientResult = await client.query(
      `DELETE FROM user_ingredients
       WHERE id = $1
       RETURNING *`,
      [userIngredientId]
    );

    if (deleteUserIngredientResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User ingredient not found" });
    }

    await client.query("COMMIT");

    res.json({
      message: "Ingredient deleted successfully",
      userIngredientId: parseInt(userIngredientId),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error deleting ingredient:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

module.exports = {
  getUserIngredients,
  toggleIngredientStock,
  addIngredient,
  deleteIngredient,
  searchFood,
  getInStockUserIngredients,
};
