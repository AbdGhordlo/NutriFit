const cron = require('node-cron');
const { createNotification } = require('../controllers/notificationsController');
const pool = require('../db');

// --- Schedule Meal Notifications ---
function scheduleMealNotificationsForUser(userId, meals) {
  meals.forEach(meal => {
    const [hour, minute] = meal.time.split(':').map(Number);
    // No longer schedule 10 min prior, just use meal time
    const cronTime = `${minute} ${hour} * * *`;
    cron.schedule(cronTime, async () => {
      await createNotification({
        userId,
        type: 'meal',
        time: meal.time,
        mealPlanMealId: meal.id
      });
    });
  });
}

// --- Schedule Exercise Notifications (similar logic) ---
function scheduleExerciseNotificationsForUser(userId, exercises) {
  exercises.forEach(exercise => {
    const [hour, minute] = exercise.time.split(':').map(Number);
    // No longer schedule 10 min prior, just use exercise time
    const cronTime = `${minute} ${hour} * * *`;
    cron.schedule(cronTime, async () => {
      await createNotification({
        userId,
        type: 'exercise',
        time: exercise.time,
        exercisePlanExerciseId: exercise.id
      });
    });
  });
}

// --- Schedule Water Reminders ---
function scheduleWaterRemindersForUser(userId) {
  const start = 6 * 60;
  const end = 21 * 60;
  const interval = (end - start) / 7;
  for (let i = 0; i < 8; i++) {
    const totalMinutes = Math.round(start + i * interval);
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const cronTime = `${minute} ${hour} * * *`;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    cron.schedule(cronTime, async () => {
      await createNotification({
        userId,
        type: 'water',
        time
      });
    });
  }
}

// Helper to get current day number for a user's adopted plan
async function getCurrentDayNumber(userId) {
  const mealPlanResult = await pool.query(
    `SELECT updated_at FROM meal_plan WHERE user_id = $1 AND is_adopted_plan = TRUE LIMIT 1`,
    [userId]
  );
  if (mealPlanResult.rows.length === 0) return 1;
  const adoptionDate = new Date(mealPlanResult.rows[0].updated_at);
  const currentDate = new Date();
  const daysSinceAdoption = Math.floor((currentDate - adoptionDate) / (1000 * 3600 * 24));
  return (daysSinceAdoption % 7) + 1;
}

// Helper to get current day number for exercise plan
async function getCurrentExerciseDayNumber(userId) {
  const exercisePlanResult = await pool.query(
    `SELECT updated_at FROM exercise_plan WHERE user_id = $1 AND is_adopted_plan = TRUE LIMIT 1`,
    [userId]
  );
  if (exercisePlanResult.rows.length === 0) return 1;
  const adoptionDate = new Date(exercisePlanResult.rows[0].updated_at);
  const currentDate = new Date();
  const daysSinceAdoption = Math.floor((currentDate - adoptionDate) / (1000 * 3600 * 24));
  return (daysSinceAdoption % 7) + 1;
}

async function getUsersWithPlans() {
  const usersResult = await pool.query('SELECT id FROM "user"');
  const users = usersResult.rows;

  for (const user of users) {
    // --- Meals ---
    const mealPlanResult = await pool.query(
      `SELECT id FROM meal_plan WHERE user_id = $1 AND is_adopted_plan = TRUE LIMIT 1`,
      [user.id]
    );
    let meals = [];
    if (mealPlanResult.rows.length > 0) {
      const mealPlanId = mealPlanResult.rows[0].id;
      const dayNumber = await getCurrentDayNumber(user.id);
      const mealsResult = await pool.query(
        `SELECT id, time FROM meal_plan_meal WHERE meal_plan_id = $1 AND day_number = $2`,
        [mealPlanId, dayNumber]
      );
      meals = mealsResult.rows;
    }
    scheduleMealNotificationsForUser(user.id, meals);

    // --- Exercises ---
    const exercisePlanResult = await pool.query(
      `SELECT id FROM exercise_plan WHERE user_id = $1 AND is_adopted_plan = TRUE LIMIT 1`,
      [user.id]
    );
    let exercises = [];
    if (exercisePlanResult.rows.length > 0) {
      const exercisePlanId = exercisePlanResult.rows[0].id;
      const dayNumber = await getCurrentExerciseDayNumber(user.id);
      const exercisesResult = await pool.query(
        `SELECT id, time FROM exercise_plan_exercise WHERE exercise_plan_id = $1 AND day_number = $2`,
        [exercisePlanId, dayNumber]
      );
      exercises = exercisesResult.rows;
    }
    scheduleExerciseNotificationsForUser(user.id, exercises);

    // --- Water Reminders ---
    scheduleWaterRemindersForUser(user.id);
  }
}

// Call this function when your server starts
getUsersWithPlans();

module.exports = {
  scheduleMealNotificationsForUser,
  scheduleExerciseNotificationsForUser,
  scheduleWaterRemindersForUser
};