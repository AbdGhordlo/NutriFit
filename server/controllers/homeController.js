const pool = require('../db');

/**
 * GET /home/meal?date=YYYY-MM-DD
 */
async function getMealProgress(req, res) {
  const userId = req.user.id;
  const { date } = req.query;
  try {
    const { rows } = await pool.query(
      `SELECT meal_id, completed
       FROM meal_progress
       WHERE user_id = $1 AND date = $2`,
      [userId, date]
    );
    res.json(rows);
  } catch (err) {
    console.error('getMealProgress error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * POST /home/meal
 */
async function upsertMealProgress(req, res) {
  const userId = req.user.id;
  const { mealId, date, completed } = req.body;
  try {
    await pool.query(
      `INSERT INTO meal_progress (user_id, date, meal_id, completed)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, date, meal_id)
       DO UPDATE SET completed = $4, created_at = CURRENT_TIMESTAMP`,
      [userId, date, mealId, completed]
    );
    res.json({ message: 'Meal progress saved.' });
  } catch (err) {
    console.error('upsertMealProgress error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * GET /home/exercise?date=YYYY-MM-DD
 */
async function getExerciseProgress(req, res) {
  const userId = req.user.id;
  const { date } = req.query;
  try {
    const { rows } = await pool.query(
      `SELECT exercise_id, completed
       FROM exercise_progress
       WHERE user_id = $1 AND date = $2`,
      [userId, date]
    );
    res.json(rows);
  } catch (err) {
    console.error('getExerciseProgress error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * POST /home/exercise
 */
async function upsertExerciseProgress(req, res) {
  const userId = req.user.id;
  const { exerciseId, date, completed } = req.body;
  try {
    await pool.query(
      `INSERT INTO exercise_progress (user_id, date, exercise_id, completed)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id, date, exercise_id)
       DO UPDATE SET completed = $4, created_at = CURRENT_TIMESTAMP`,
      [userId, date, exerciseId, completed]
    );
    res.json({ message: 'Exercise progress saved.' });
  } catch (err) {
    console.error('upsertExerciseProgress error:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getMealProgress,
  upsertMealProgress,
  getExerciseProgress,
  upsertExerciseProgress
};
