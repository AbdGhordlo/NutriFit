const pool = require('../db');

// Function to get personalization data for a user
const getPersonalizationData = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT 
          p.personalization_id,
          p.steps_data,
          p.completed,
          p.created_at,
          p.updated_at
        FROM personalization p
        WHERE p.user_id = $1`,
        [userId]
      );
  
      if (result.rows.length === 0) {
        // Return an empty object if no data exists
        return res.status(200).json({ steps_data: {} });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };


// Function to create or update personalization data for a user
const createPersonalizationData = async (req, res) => {
  const { userId } = req.params;
  const { steps_data, completed } = req.body;

  if (!steps_data || typeof completed !== 'boolean') {
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
         SET steps_data = $1, completed = $2, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3`,
        [steps_data, completed, userId]
      );
      return res.status(200).json({ message: 'Personalization data updated successfully.' });
    } else {
      // Insert new personalization data
      await pool.query(
        `INSERT INTO personalization (user_id, steps_data, completed) 
         VALUES ($1, $2, $3)`,
        [userId, steps_data, completed]
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
    const { steps_data } = req.body;
  
    if (!steps_data) {
      return res.status(400).json({ message: 'Step data is required.' });
    }
  
    try {
      const result = await pool.query(
        `SELECT steps_data FROM personalization WHERE user_id = $1`,
        [userId]
      );
  
      if (result.rows.length === 0) {
        // If no data exists, create a new entry
        await pool.query(
          `INSERT INTO personalization (user_id, steps_data) 
           VALUES ($1, $2)`,
          [userId, { [`step_${stepNumber}`]: steps_data }]
        );
        return res.status(201).json({ message: `Step ${stepNumber} created successfully.` });
      }
  
      // Get the current step data
      const currentStepData = result.rows[0].steps_data || {};
  
      // Update the step data
      currentStepData[`step_${stepNumber}`] = steps_data;
  
      // Update the personalization data with the new step
      await pool.query(
        `UPDATE personalization 
         SET steps_data = $1, updated_at = CURRENT_TIMESTAMP
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
