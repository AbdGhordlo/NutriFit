const pool = require('../db');

// Function to get personalization data for a user
const getPersonalizationData = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        p.personalization_id,
        p.step_data,
        p.completed,
        p.created_at,
        p.updated_at
      FROM personalization p
      WHERE p.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Personalization data not found for this user.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// ! The functions below needs to be validated/tested

// Function to create or update personalization data for a user
const createPersonalizationData = async (req, res) => {
  const { userId } = req.params;
  const { step_data, completed } = req.body;

  if (!step_data || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request data.' });
  }

  try {
    const existingResult = await pool.query(
      `SELECT * FROM personalization WHERE user_id = $1`,
      [userId]
    );

    if (existingResult.rows.length > 0) {
      // Update existing personalization data
      await pool.query(
        `UPDATE personalization 
         SET step_data = $1, completed = $2, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3`,
        [step_data, completed, userId]
      );
      return res.status(200).json({ message: 'Personalization data updated successfully.' });
    } else {
      // Insert new personalization data
      await pool.query(
        `INSERT INTO personalization (user_id, step_data, completed) 
         VALUES ($1, $2, $3)`,
        [userId, step_data, completed]
      );
      return res.status(201).json({ message: 'Personalization data created successfully.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Function to update a specific step of personalization data
const updatePersonalizationStep = async (req, res) => {
  const { userId, stepNumber } = req.params;
  const { step_data } = req.body;

  if (!step_data) {
    return res.status(400).json({ message: 'Step data is required.' });
  }

  try {
    const result = await pool.query(
      `SELECT step_data FROM personalization WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Personalization data not found for this user.' });
    }

    // Get the current step data
    const currentStepData = result.rows[0].step_data;

    // Assuming step data is stored as an object, e.g., { step_1: ..., step_2: ... }
    currentStepData[`step_${stepNumber}`] = step_data;

    // Update the personalization data with the new step
    await pool.query(
      `UPDATE personalization 
       SET step_data = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [currentStepData, userId]
    );

    return res.status(200).json({ message: `Step ${stepNumber} updated successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getPersonalizationData,
  createPersonalizationData,
  updatePersonalizationStep
};
