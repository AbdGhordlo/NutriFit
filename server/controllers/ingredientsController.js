const pool = require('../db');

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
        ui.in_stock AS inStock
      FROM user_ingredients ui
      JOIN user_ingredient_ingredient uii ON ui.id = uii.user_ingredients_id
      JOIN ingredient i ON uii.ingredient_id = i.id
      WHERE ui.user_id = $1
      ORDER BY i.category, i.name`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
  const { userId, ingredientId } = req.params;
  const { inStock } = req.body;

  try {
    const userIngredient = await pool.query(
      `SELECT ui.id
       FROM user_ingredients ui
       JOIN user_ingredient_ingredient uii ON ui.id = uii.user_ingredients_id
       WHERE ui.user_id = $1 AND uii.ingredient_id = $2`,
      [userId, ingredientId]
    );

    if (userIngredient.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found for this user' });
    }

    const result = await pool.query(
      'UPDATE user_ingredients SET in_stock = $1 WHERE id = $2 RETURNING *',
      [inStock, userIngredient.rows[0].id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const addIngredient = async (req, res) => {
  const { ingredientId, name, category, calories, protein, carbs, fats } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Start transaction

    // Insert into ingredient table
    const ingredientResult = await client.query(
      `INSERT INTO ingredient (name, category, calories, protein, carbs, fats)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, category, calories, protein, carbs, fats]
    );

    const ingredientId = ingredientResult.rows[0].id;

    const userIngredientResult = await pool.query(
      `INSERT INTO user_ingredients (user_id)
       VALUES ($1)
       RETURNING *`,
      [userId]
    );

    const userIngredientId = userIngredientResult.rows[0].id;

    // Link ingredient to user_ingredients
    await pool.query(
      `INSERT INTO user_ingredient_ingredient (user_ingredients_id, ingredient_id)
       VALUES ($1, $2)`,
      [userIngredientId, ingredientId]
    );

    await client.query('COMMIT'); // Commit transaction
    res.status(201).json(ingredientResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction if any error occurs
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release(); // Release client back to pool
  }
};

module.exports = {
  getUserIngredients,
  toggleIngredientStock,
  addIngredient,
  getInStockUserIngredients
};
