const pool = require('../db');

// Get settings for a user
const getUserSettings = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        meal_reminders,
        exercise_reminders,
        progress_updates,
        water_intake_reminder,
        personalize_steps,
        personalize_completed
      FROM settings
      WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Settings not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).send('Server error');
  }
};

// Update settings for a user
const updateUserSettings = async (req, res) => {
  const { userId } = req.params;
  const {
    meal_reminders,
    exercise_reminders,
    progress_updates,
    water_intake_reminder,
    personalize_steps,
    personalize_completed,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO settings (user_id, meal_reminders, exercise_reminders, progress_updates, 
        water_intake_reminder, personalize_steps, personalize_completed, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (user_id) 
       DO UPDATE SET 
        meal_reminders = EXCLUDED.meal_reminders,
        exercise_reminders = EXCLUDED.exercise_reminders,
        progress_updates = EXCLUDED.progress_updates,
        water_intake_reminder = EXCLUDED.water_intake_reminder,
        personalize_steps = EXCLUDED.personalize_steps,
        personalize_completed = EXCLUDED.personalize_completed,
        updated_at = NOW()`,
      [
        userId,
        meal_reminders,
        exercise_reminders,
        progress_updates,
        water_intake_reminder,
        personalize_steps,
        personalize_completed,
      ]
    );

    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).send('Server error');
  }
};

module.exports = { getUserSettings, updateUserSettings };
