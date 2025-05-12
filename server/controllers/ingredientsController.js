const pool = require("../db");

// Get user ingredients (grouped by category)
const getUserIngredients = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        i.id AS ingredient_id,
        i.name AS ingredient_name,
        i.category AS ingredient_category,
        i.calories AS ingredient_calories,
        i.protein AS ingredient_protein,
        i.carbs AS ingredient_carbs,
        i.fats AS ingredient_fats,
        i.serving_size AS ingredient_serving_size,
        ui.in_stock AS in_stock,
        ui.id AS user_ingredient_id
        
      FROM user_ingredient_ingredient uii
      JOIN (
        SELECT DISTINCT ON (uii.ingredient_id)
          uii.ingredient_id,
          uii.user_ingredients_id
        FROM user_ingredient_ingredient uii
        JOIN user_ingredients ui ON uii.user_ingredients_id = ui.id
        WHERE ui.user_id = $1
        ORDER BY uii.ingredient_id, uii.created_at DESC
      ) latest ON latest.ingredient_id = uii.ingredient_id AND latest.user_ingredients_id = uii.user_ingredients_id
      JOIN user_ingredients ui ON uii.user_ingredients_id = ui.id
      JOIN ingredient i ON uii.ingredient_id = i.id
      ORDER BY i.category, i.name`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1️⃣ Check if the ingredient exists in general
    const existingIngredientResult = await client.query(
      `SELECT id FROM ingredient WHERE name = $1 AND category = $2`,
      [name, category]
    );

    let ingredientId;
    if (existingIngredientResult.rows.length > 0) {
      ingredientId = existingIngredientResult.rows[0].id;

      // 2️⃣ Check if this user already added this ingredient
      const alreadyLinkedResult = await client.query(
        `SELECT ui.id
         FROM user_ingredients ui
         JOIN user_ingredient_ingredient uii ON ui.id = uii.user_ingredients_id
         WHERE ui.user_id = $1 AND uii.ingredient_id = $2`,
        [userId, ingredientId]
      );

      if (alreadyLinkedResult.rows.length > 0) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: "Ingredient already added by user" });
      }
    } else {
      // 3️⃣ Insert new ingredient
      const insertIngredientResult = await client.query(
        `INSERT INTO ingredient (name, category, calories, protein, carbs, fats, serving_size)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [name, category, calories, protein, carbs, fats, serving_size]
      );
      ingredientId = insertIngredientResult.rows[0].id;
    }

    // 4️⃣ Create user_ingredients row
    const insertUserIngredientResult = await client.query(
      `INSERT INTO user_ingredients (user_id, in_stock)
       VALUES ($1, $2)
       RETURNING id`,
      [userId, true]
    );
    const userIngredientId = insertUserIngredientResult.rows[0].id;

    // 5️⃣ Link user_ingredients with ingredient
    await client.query(
      `INSERT INTO user_ingredient_ingredient (user_ingredients_id, ingredient_id)
       VALUES ($1, $2)`,
      [userIngredientId, ingredientId]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Ingredient added successfully",
      ingredient: {
        user_ingredient_id: userIngredientId,
        ingredient_id: ingredientId,
        name,
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

    if (error.code === "23505") {
      return res.status(409).json({ error: "Ingredient name must be unique." });
    }

    console.error("Error adding ingredient:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

const searchFood = async (query) => {
  const apiKey = "xOhA0U8ldEU349zVzOAiS9qJxvyU1VJGMcM6lYVW"; // Replace with your actual API key
  if (!query) {
    throw new Error("Query parameter is required");
  }
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.foods; // Bu, arama sonuçlarının listesi
};

const deleteIngredient = async (req, res) => {
  const { userIngredientId } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // First delete the link in user_ingredient_ingredient table
    const deleteIngredientLinkResult = await client.query(
      `DELETE FROM user_ingredient_ingredient
       WHERE user_ingredients_id = $1
       RETURNING *`,
      [userIngredientId]
    );

    // Then delete the user_ingredients entry
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
};
