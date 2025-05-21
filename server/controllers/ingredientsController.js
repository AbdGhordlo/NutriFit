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

  // Validation
  if (!name || !category) {
    return res.status(400).json({ error: "Name and category are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Generate a unique name by incorporating the category if needed
    // This approach treats the ingredient name as "{original_name}_{category}"
    // We'll display just the original name to the user, but store it uniquely
    const processedName = `${name}_${category}`;

    // Check if this exact processed name already exists
    const existingIngredientResult = await client.query(
      `SELECT id FROM ingredient WHERE name = $1`,
      [processedName]
    );

    let ingredientId;

    if (existingIngredientResult.rows.length > 0) {
      // This exact ingredient with this name and category already exists
      ingredientId = existingIngredientResult.rows[0].id;

      // Check if the user already has this ingredient
      const alreadyLinkedResult = await client.query(
        `SELECT id FROM user_ingredients
         WHERE user_id = $1 AND ingredient_id = $2`,
        [userId, ingredientId]
      );

      if (alreadyLinkedResult.rows.length > 0) {
        await client.query("ROLLBACK");
        return res
          .status(409)
          .json({ error: "This ingredient is already added for the user." });
      }
    } else {
      // No conflict, insert new ingredient with the processed name
      const insertIngredientResult = await client.query(
        `INSERT INTO ingredient (name, category, calories, protein, carbs, fats, serving_size)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [processedName, category, calories, protein, carbs, fats, serving_size]
      );
      ingredientId = insertIngredientResult.rows[0].id;
    }

    // Create user_ingredients entry
    const insertUserIngredientResult = await client.query(
      `INSERT INTO user_ingredients (user_id, in_stock, ingredient_id)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [userId, true, ingredientId]
    );

    const userIngredientId = insertUserIngredientResult.rows[0].id;

    await client.query("COMMIT");

    res.status(201).json({
      message: "Ingredient added successfully",
      ingredient: {
        user_ingredient_id: userIngredientId,
        ingredient_id: ingredientId,
        // We return the original name to the user, not the processed one
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

    console.error("Error adding ingredient:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
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
