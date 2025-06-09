const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');

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
  uploadProgressPhoto,
  listProgressPhotos,
  deleteProgressPhoto
};
