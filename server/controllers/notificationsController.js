const pool = require("../db");

// Create notifications 
async function createNotification({ userId, type, time, mealPlanMealId = null, exercisePlanExerciseId = null }) {
  await pool.query(
    `INSERT INTO notification (user_id, meal_plan_meal_id, exercise_plan_exercise_id, notification_type, notification_time)
     VALUES ($1, $2, $3, $4, $5)` ,
    [userId, mealPlanMealId, exercisePlanExerciseId, type, time]
  );
}

// Fetch notifications for a user
async function getUserNotifications(req, res) {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM notification WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

// Delete a specific notification
async function deleteNotification(req, res) {
  const { notificationId } = req.params;
  try {
    await pool.query(
      `DELETE FROM notification WHERE id = $1`,
      [notificationId]
    );
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
}

module.exports = {
  getUserNotifications,
  deleteNotification,
  createNotification,
};