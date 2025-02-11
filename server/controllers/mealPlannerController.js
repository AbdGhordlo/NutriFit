const pool = require('../db');

const getMealPlanByUser = async (req, res) => {
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
      WHERE mp.user_id = $1
      ORDER BY mpm.day_number, mpm.meal_order`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = { getMealPlanByUser };
