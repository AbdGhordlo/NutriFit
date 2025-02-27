const express = require('express');
const router = express.Router();
const { getSettingsByUser, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth'); // Import auth middleware

// Get settings for a user
router.get('/:userId', auth, getSettingsByUser); // Protect the route

// Update settings for a user
router.put('/:userId', auth, updateSettings); // Protect the route

module.exports = router;
