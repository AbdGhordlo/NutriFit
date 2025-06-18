const pool = require('../db');

/**
 * GET /home/meal?date=YYYY-MM-DD
 */
async function getMealProgress(req, res) {
  const userId = req.user.id;
  const { date } = req.query;
  try {
    const { rows } = await pool.query(
      `SELECT meal_plan_meal_id
       FROM meal_progress
       WHERE user_id = $1 AND date = $2`,
      [userId, date]
    );
    const completedMealPlanMealIds = rows.map(row => row.meal_plan_meal_id);
    res.json(completedMealPlanMealIds);
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
  const { mealPlanMealId, date, completed } = req.body;
  try {
    if (completed) {
      // Insert if marked completed
      await pool.query(
        `INSERT INTO meal_progress (user_id, date, meal_plan_meal_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [userId, date, mealPlanMealId]
      );
    } else {
      // Delete if marked incomplete
      await pool.query(
        `DELETE FROM meal_progress
         WHERE user_id = $1 AND date = $2 AND meal_plan_meal_id = $3`,
        [userId, date, mealPlanMealId]
      );
    }
    res.json({ message: 'Meal progress updated.' });
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
      `SELECT exercise_plan_exercise_id
       FROM exercise_progress
       WHERE user_id = $1 AND date = $2`,
      [userId, date]
    );
    const completedExerciseIds = rows.map(row => row.exercise_plan_exercise_id);
    res.json(completedExerciseIds);
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
    if (completed) {
      // Insert if marked completed
      await pool.query(
        `INSERT INTO exercise_progress (user_id, date, exercise_plan_exercise_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [userId, date, exerciseId]
      );
    } else {
      // Delete if marked incomplete
      await pool.query(
        `DELETE FROM exercise_progress
         WHERE user_id = $1 AND date = $2 AND exercise_plan_exercise_id = $3`,
        [userId, date, exerciseId]
      );
    }
    res.json({ message: 'Exercise progress updated.' });
  } catch (err) {
    console.error('upsertExerciseProgress error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * DELETE /home/meal/today
 * Deletes all meal_progress entries for the user for today
 */
async function resetDailyMealProgress(req, res) {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    await pool.query(
      `DELETE FROM meal_progress WHERE user_id = $1 AND date = $2`,
      [userId, today]
    );
    res.json({ message: "Today's meal progress reset." });
  } catch (err) {
    console.error('resetDailyMealProgress error:', err);
    res.status(500).json({ message: err.message });
  }
}

/**
 * DELETE /home/exercise/today
 * Deletes all exercise_progress entries for the user for today
 */
async function resetDailyExerciseProgress(req, res) {
  const userId = req.user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    await pool.query(
      `DELETE FROM exercise_progress WHERE user_id = $1 AND date = $2`,
      [userId, today]
    );
    res.json({ message: "Today's exercise progress reset." });
  } catch (err) {
    console.error('resetDailyExerciseProgress error:', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getMealProgress,
  upsertMealProgress,
  getExerciseProgress,
  upsertExerciseProgress,
  resetDailyMealProgress,
  resetDailyExerciseProgress
};
