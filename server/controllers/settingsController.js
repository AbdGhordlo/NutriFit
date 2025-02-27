const pool = require('../db');

// Fetch settings by user ID
const getSettingsByUser = async (req, res) => {
  const { userId } = req.params; // Assuming you're passing userId as a param
  try {
    const result = await pool.query(
      `SELECT 
        full_name,
        email,
        workout_reminders,
        meal_tracking,
        progress_updates
      FROM settings 
      WHERE user_id = $1
      LIMIT 1`,
      [userId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Settings not found');
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).send('Server error');
  }
};

// Update settings for the logged-in user
const updateSettings = async (req, res) => {
  const { userId } = req.params; // Assuming you're passing userId as a param
  const { 
    full_name, 
    email, 
    workout_reminders, 
    meal_tracking, 
    progress_updates, 
  } = req.body;

  try {
    // Update settings query to reflect new fields (add the new fields)
    const result = await pool.query(
      `UPDATE settings
       SET full_name = $1, email = $2, workout_reminders = $3, meal_tracking = $4, 
           progress_updates = $5, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6
       RETURNING *`,
      [full_name, email, workout_reminders, meal_tracking, progress_updates, userId]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Settings not found');
    }
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).send('Server error');
  }
};

module.exports = { getSettingsByUser, updateSettings };
