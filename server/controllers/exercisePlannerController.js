const pool = require('../db');

const getExercisePlanByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        ep.id AS exercise_plan_id,
        ep.name AS exercise_plan_name,
        ep.description AS exercise_plan_description,
        epe.day_number,
        epe.exercise_order,
        TO_CHAR(epe.time, 'HH24:MI') AS time, -- Format time for consistency
        epe.reps,
        epe.sets,
        epe.duration,
        e.id AS exercise_id,
        e.name AS exercise_name,
        e.description AS exercise_description,
        e.calories_burned,
        e.has_reps_sets,
        e.has_duration
      FROM exercise_plan ep
      JOIN exercise_plan_exercise epe ON ep.id = epe.exercise_plan_id
      JOIN exercise e ON epe.exercise_id = e.id
      WHERE ep.user_id = $1
      ORDER BY epe.day_number, epe.exercise_order`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = { getExercisePlanByUser };
