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
const uploadProfilePicture = async (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Step A: fetch the old URL before multer runs
  let oldFileUrl = null;
  try {
    const { rows } = await pool.query(
      `SELECT profile_picture FROM "user" WHERE id = $1`,
      [userId]
    );
    if (rows.length > 0) {
      oldFileUrl = rows[0].profile_picture;
    }
  } catch (dbErr) {
    console.error("Error fetching old profile picture URL:", dbErr);
  }

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Error: ${err.message}` });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Build new URL
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const newFileUrl = `${baseUrl}/${req.file.path.replace(/\\/g, "/")}`;

    // Step B: delete old file from disk (if it exists)
    if (oldFileUrl) {
      try {
        // Derive the file path from the oldFileUrl, e.g.
        // oldFileUrl = "http://localhost:5000/uploads/profile-pictures/…"
        const urlPath = oldFileUrl.split(req.get("host"))[1]; 
        // urlPath might be "/uploads/profile-pictures/profile-12345.png"
        const oldFilePath = path.join(__dirname, "..", urlPath);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (unlinkErr) {
        console.error("Failed to delete old profile picture:", unlinkErr);
      }
    }

    // Step C: update the “user” and “settings” tables with new URL
    try {
      await pool.query(
        `UPDATE "user" 
         SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [newFileUrl, userId]
      );
      await pool.query(
        `UPDATE settings 
         SET profile_picture = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $2`,
        [newFileUrl, userId]
      );
    } catch (updateErr) {
      console.error("Error updating profile picture in DB:", updateErr);
      return res.status(500).json({ message: "Server error" });
    }

    return res.json({
      message: "Profile picture uploaded successfully",
      url: newFileUrl,
    });
  });
};

/**
 * DELETE /upload/:userId/profile-picture
 * Remove the current profile picture (delete file + clear DB fields).
 */
const deleteProfilePicture = async (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ message: "Access denied" });
  }

  // Step 1: fetch the existing URL
  let oldFileUrl = null;
  try {
    const { rows } = await pool.query(
      `SELECT profile_picture FROM "user" WHERE id = $1`,
      [userId]
    );
    if (rows.length > 0) {
      oldFileUrl = rows[0].profile_picture;
    }
  } catch (dbErr) {
    console.error("Error fetching existing profile picture:", dbErr);
    return res.status(500).json({ message: "Server error" });
  }

  // Step 2: delete the file from disk, if we have a URL
  if (oldFileUrl) {
    try {
      const urlPath = oldFileUrl.split(req.get("host"))[1];
      const oldFilePath = path.join(__dirname, "..", urlPath);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    } catch (unlinkErr) {
      console.error("Failed to delete old profile picture:", unlinkErr);
      // (We can continue even if unlink fails; maybe it was already deleted.)
    }
  }

  // Step 3: clear the DB columns
  try {
    await pool.query(
      `UPDATE "user" 
       SET profile_picture = NULL, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [userId]
    );
    await pool.query(
      `UPDATE settings 
       SET profile_picture = NULL, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1`,
      [userId]
    );
  } catch (updateErr) {
    console.error("Error clearing profile picture in DB:", updateErr);
    return res.status(500).json({ message: "Server error" });
  }

  return res.json({ message: "Profile picture removed successfully" });
};

module.exports = {
  uploadProfilePicture,
  deleteProfilePicture,
};