const pool = require('../db');
const bcrypt = require('bcrypt');

/**
 * Get user settings including profile and notification preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserSettings = async (req, res) => {
  const { userId } = req.params;
  
  // Verify that the authenticated user is requesting their own data
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // Get user profile information
    const userResult = await pool.query(
      `SELECT 
        id,
        username AS full_name,
        email,
        profile_picture AS photo_url
      FROM "user"
      WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user notification settings
    const notificationResult = await pool.query(
      `SELECT 
        meal_reminders,
        exercise_reminders,
        progress_updates,
        water_intake_reminder
      FROM settings
      WHERE user_id = $1`,
      [userId]
    );

    // If no notification settings exist, create default settings
    let notificationSettings;
    if (notificationResult.rows.length === 0) {
      const defaultSettings = {
        meal_reminders: true,
        exercise_reminders: true,
        progress_updates: true,
        water_intake_reminder: true,
      };

      // Insert default notification settings
      await pool.query(
        `INSERT INTO settings
          (user_id, meal_reminders, exercise_reminders, progress_updates, water_intake_reminder)
        VALUES ($1, $2, $3, $4, $5)`,
        [userId, defaultSettings.meal_reminders, defaultSettings.exercise_reminders, 
         defaultSettings.progress_updates, defaultSettings.water_intake_reminder]
      );

      notificationSettings = defaultSettings;
    } else {
      notificationSettings = notificationResult.rows[0];
    }

    // Check if user has completed personalization
    const personalizationResult = await pool.query(
      `SELECT completed FROM personalization WHERE user_id = $1`,
      [userId]
    );

    // Also check in settings table (as a fallback)
    const settingsPersonalizationResult = await pool.query(
      `SELECT personalize_completed FROM settings WHERE user_id = $1`,
      [userId]
    );

    // Check both tables for personalization status
    let hasCompletedPersonalization = false;
    if (personalizationResult.rows.length > 0 && personalizationResult.rows[0].completed) {
      hasCompletedPersonalization = true;
    } else if (settingsPersonalizationResult.rows.length > 0 && settingsPersonalizationResult.rows[0].personalize_completed) {
      hasCompletedPersonalization = true;
    }

    // Format and send response
    res.json({
      profile: {
        fullName: userResult.rows[0].full_name,
        email: userResult.rows[0].email,
        photoUrl: userResult.rows[0].photo_url || '',
      },
      notifications: {
        mealReminders: notificationSettings.meal_reminders,
        exerciseReminders: notificationSettings.exercise_reminders,
        progressUpdates: notificationSettings.progress_updates,
        waterIntakeReminder: notificationSettings.water_intake_reminder,
      },
      personalizationCompleted: hasCompletedPersonalization
    });
  } catch (err) {
    console.error('Error getting user settings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user notification settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserSettings = async (req, res) => {
  const { userId } = req.params;
  const { notifications } = req.body;
  
  // Verify that the authenticated user is updating their own data
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // Check if notification settings exist
    const checkResult = await pool.query(
      `SELECT id FROM settings WHERE user_id = $1`,
      [userId]
    );

    if (checkResult.rows.length === 0) {
      // Create new notification settings
      await pool.query(
        `INSERT INTO settings
          (user_id, meal_reminders, exercise_reminders, progress_updates, water_intake_reminder)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          userId, 
          notifications.mealReminders, 
          notifications.exerciseReminders, 
          notifications.progressUpdates, 
          notifications.waterIntakeReminder
        ]
      );
    } else {
      // Update existing notification settings
      await pool.query(
        `UPDATE settings
        SET 
          meal_reminders = $1,
          exercise_reminders = $2,
          progress_updates = $3,
          water_intake_reminder = $4,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $5`,
        [
          notifications.mealReminders,
          notifications.exerciseReminders,
          notifications.progressUpdates,
          notifications.waterIntakeReminder,
          userId
        ]
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    console.error('Error updating user settings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user profile information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, photoUrl } = req.body;
  
  // Verify that the authenticated user is updating their own data
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // Check if email is already taken by another user
    if (email) {
      const emailCheckResult = await pool.query(
        `SELECT id FROM "user" WHERE email = $1 AND id != $2`,
        [email, userId]
      );

      if (emailCheckResult.rows.length > 0) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Update user profile in the user table
    await pool.query(
      `UPDATE "user"
      SET 
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        profile_picture = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4`,
      [fullName, email, photoUrl, userId]
    );

    // Also update profile_picture in settings if it exists
    if (photoUrl) {
      await pool.query(
        `UPDATE settings
        SET 
          profile_picture = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2`,
        [photoUrl, userId]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUserPassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;
  
  // Verify that the authenticated user is updating their own password
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  try {
    // Get current password hash
    const userResult = await pool.query(
      `SELECT password_hash FROM "user" WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordHash = userResult.rows[0].password_hash;

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await pool.query(
      `UPDATE "user"
      SET 
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2`,
      [hashedPassword, userId]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating user password:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserSettings,
  updateUserSettings,
  updateUserProfile,
  updateUserPassword
};
