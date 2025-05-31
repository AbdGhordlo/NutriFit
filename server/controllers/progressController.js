const pool = require('../db');

// Function to get progress data for a user
const getProgressData = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        p.id,
        p.weights,
        p.waists,
        p.hips,
        p.body_fats,
        p.images,
        p.start_date,
        p.target_date,
        p.penalty_days,
        p.created_at,
        p.updated_at
      FROM progress p
      WHERE p.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'No progress data found for this user.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Function to create or update progress data for a user
const createOrUpdateProgressData = async (req, res) => {
  const { userId } = req.params;
  const { weights, waists, hips, body_fats, images, start_date, target_date, penalty_days } = req.body;

  if (!weights || !waists || !hips || !body_fats || !images || !start_date || !target_date) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const existingResult = await pool.query(
      `SELECT * FROM progress WHERE user_id = $1`,
      [userId]
    );

    if (existingResult.rows.length > 0) {
      // Update existing progress data
      await pool.query(
        `UPDATE progress 
         SET weights = $1, waists = $2, hips = $3, body_fats = $4, images = $5, start_date = $6, target_date = $7, penalty_days = $8, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $9`,
        [weights, waists, hips, body_fats, images, start_date, target_date, penalty_days, userId]
      );
      return res.status(200).json({ message: 'Progress data updated successfully.' });
    } else {
      // Insert new progress data
      await pool.query(
        `INSERT INTO progress (user_id, weights, waists, hips, body_fats, images, start_date, target_date, penalty_days) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [userId, weights, waists, hips, body_fats, images, start_date, target_date, penalty_days]
      );
      return res.status(201).json({ message: 'Progress data created successfully.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Function to update specific progress data
const updateProgressData = async (req, res) => {
  const { userId, progressId } = req.params;
  const { weights, waists, hips, body_fats, images, start_date, target_date, penalty_days } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM progress WHERE id = $1 AND user_id = $2`,
      [progressId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Progress data not found.' });
    }

    await pool.query(
      `UPDATE progress 
       SET weights = $1, waists = $2, hips = $3, body_fats = $4, images = $5, start_date = $6, target_date = $7, penalty_days = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9`,
      [weights, waists, hips, body_fats, images, start_date, target_date, penalty_days, progressId]
    );

    return res.status(200).json({ message: 'Progress data updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Function to get completed_days_count for a user
const getCompletedDaysCount = async (req, res) => {
  const { userId } = req.params;
  try {
    let result = await pool.query(
      'SELECT completed_days_count FROM progress WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      // No entry, create one with default value 0
      await pool.query(
        'INSERT INTO progress (user_id, completed_days_count) VALUES ($1, 0)',
        [userId]
      );
      result = await pool.query(
        'SELECT completed_days_count FROM progress WHERE user_id = $1',
        [userId]
      );
    }
    res.json({ completed_days_count: result.rows[0].completed_days_count });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Function to increment or decrement completed_days_count for a user
const updateCompletedDaysCount = async (req, res) => {
  const { userId } = req.params;
  const { increment } = req.body; // expects { increment: true } or { increment: false }

  try {
    // Check if user progress exists
    let result = await pool.query(
      'SELECT completed_days_count FROM progress WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      // No entry, create one with default value 0
      await pool.query(
        'INSERT INTO progress (user_id, completed_days_count) VALUES ($1, 0)',
        [userId]
      );
      result = await pool.query(
        'SELECT completed_days_count FROM progress WHERE user_id = $1',
        [userId]
      );
    }
    let newCount = result.rows[0].completed_days_count;
    if (increment) {
      newCount += 1;
    } else {
      newCount = Math.max(0, newCount - 1);
    }
    await pool.query(
      'UPDATE progress SET completed_days_count = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [newCount, userId]
    );
    res.json({ completed_days_count: newCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getProgressData,
  createOrUpdateProgressData,
  updateProgressData,
  getCompletedDaysCount,
  updateCompletedDaysCount
};
