const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// Function to get penalty_days_count for a user
const getPenaltyDaysCount = async (req, res) => {
  const { userId } = req.params;
  try {
    let result = await pool.query(
      'SELECT penalty_days_count FROM progress WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      // No entry, create one with default value 0
      await pool.query(
        'INSERT INTO progress (user_id, penalty_days_count) VALUES ($1, 0)',
        [userId]
      );
      result = await pool.query(
        'SELECT penalty_days_count FROM progress WHERE user_id = $1',
        [userId]
      );
    }
    res.json({ penalty_days_count: result.rows[0].penalty_days_count });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Function to increment or decrement penalty_days_count for a user
const updatePenaltyDaysCount = async (req, res) => {
  const { userId } = req.params;
  const { increment } = req.body; // expects { increment: true } or { increment: false }

  try {
    // Check if user progress exists
    let result = await pool.query(
      'SELECT penalty_days_count FROM progress WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      // No entry, create one with default value 0
      await pool.query(
        'INSERT INTO progress (user_id, penalty_days_count) VALUES ($1, 0)',
        [userId]
      );
      result = await pool.query(
        'SELECT penalty_days_count FROM progress WHERE user_id = $1',
        [userId]
      );
    }
    let newCount = result.rows[0].penalty_days_count;
    if (increment) {
      newCount += 1;
    } else {
      newCount = Math.max(0, newCount - 1);
    }
    await pool.query(
      'UPDATE progress SET penalty_days_count = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
      [newCount, userId]
    );
    res.json({ penalty_days_count: newCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Add a new measurement to the body_measurements table
const addMeasurement = async (req, res) => {
  const { userId, measurement_type, value, unit, measured_at } = req.body;
  if (!userId || !measurement_type || value === undefined) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO body_measurements (user_id, measurement_type, value, unit, measured_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, measurement_type, value, unit || null, measured_at || new Date()]
    );
    res.status(201).json({ message: 'Measurement added successfully.', measurement: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all measurements of a specific type for a user
const getMeasurementsByType = async (req, res) => {
  const { userId, measurement_type } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM body_measurements WHERE user_id = $1 AND measurement_type = $2 ORDER BY measured_at ASC`,
      [userId, measurement_type]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Edit (overwrite) the most recent measurement of a type within a 2-week window
const editLastMeasurement = async (req, res) => {
  const { userId, measurement_type } = req.params;
  const { value, unit, measured_at } = req.body;
  if (!userId || !measurement_type || value === undefined) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  try {
    // Find the most recent measurement of this type within the last 2 weeks
    const twoWeeksAgo = new Date(measured_at || new Date());
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const result = await pool.query(
      `SELECT * FROM body_measurements WHERE user_id = $1 AND measurement_type = $2 AND measured_at >= $3 ORDER BY measured_at DESC LIMIT 1`,
      [userId, measurement_type, twoWeeksAgo]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No recent measurement found to overwrite.' });
    }
    const measurementId = result.rows[0].id;
    const updateResult = await pool.query(
      `UPDATE body_measurements SET value = $1, unit = $2, measured_at = $3 WHERE id = $4 RETURNING *`,
      [value, unit || result.rows[0].unit, measured_at || result.rows[0].measured_at, measurementId]
    );
    res.status(200).json({ message: 'Measurement updated successfully.', measurement: updateResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// --- Progress Photo Logic (moved from progressPhotoController.js ---

// Configure storage for progress photos
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/progress-photos';
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'progress-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter: fileFilter
}).single('progressPhoto');

// Upload a progress photo
const uploadProgressPhoto = (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
    try {
      // Insert into progress_photo table and return the inserted row
      const insertResult = await pool.query(
        `INSERT INTO progress_photo (user_id, file_path, file_name, file_type) VALUES ($1, $2, $3, $4) RETURNING id, file_path AS url, file_name, file_type, uploaded_at`,
        [userId, fileUrl, req.file.filename, req.file.mimetype]
      );
      const photo = insertResult.rows[0];
      res.json(photo);
    } catch (error) {
      console.error('Error saving progress photo:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// List all progress photos for a user
const listProgressPhotos = async (req, res) => {
  const { userId } = req.params;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    const result = await pool.query(
      `SELECT id, file_path AS url, file_name, file_type, uploaded_at FROM progress_photo WHERE user_id = $1 ORDER BY uploaded_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching progress photos:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a progress photo
const deleteProgressPhoto = async (req, res) => {
  const { userId, photoId } = req.params;
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  try {
    // Get file path
    const result = await pool.query(
      `SELECT file_path FROM progress_photo WHERE id = $1 AND user_id = $2`,
      [photoId, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    const filePath = result.rows[0].file_path.replace(`${req.protocol}://${req.get('host')}/`, '');
    // Delete file from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // Delete from DB
    await pool.query(`DELETE FROM progress_photo WHERE id = $1 AND user_id = $2`, [photoId, userId]);
    res.json({ message: 'Progress photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProgressData,
  createOrUpdateProgressData,
  updateProgressData,
  getCompletedDaysCount,
  updateCompletedDaysCount,
  getPenaltyDaysCount,
  updatePenaltyDaysCount,
  addMeasurement,
  getMeasurementsByType,
  editLastMeasurement,
  uploadProgressPhoto,
  listProgressPhotos,
  deleteProgressPhoto,
};
