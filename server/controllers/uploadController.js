const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/profile-pictures';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter - only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Initialize multer upload
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter: fileFilter
}).single('profilePicture');

/**
 * Upload a profile picture
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadProfilePicture = (req, res) => {
  const userId = req.params.userId;

  // Verify that the authenticated user is uploading their own picture
  if (req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: `Error: ${err.message}` });
    }

    // File uploaded successfully
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Generate the full URL to the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;

    try {
      // Update user profile picture in the user table
      await pool.query(
        `UPDATE "user" SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
        [fileUrl, userId]
      );

      // Also update in settings table if it exists
      await pool.query(
        `UPDATE settings SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $2`,
        [fileUrl, userId]
      );

      res.json({ 
        message: 'Profile picture uploaded successfully',
        url: fileUrl
      });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

module.exports = {
  uploadProfilePicture
};
