const express = require('express');
const { uploadProfilePicture } = require('../controllers/uploadController');
const router = express.Router();

// Upload profile picture
router.post('/:userId/profile-picture', uploadProfilePicture);

module.exports = router;