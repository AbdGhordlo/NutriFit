const express = require('express');
const { getUserSettings, updateUserSettings } = require('../controllers/settingsController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/:userId', verifyToken, getUserSettings);
router.post('/:userId', verifyToken, updateUserSettings);

module.exports = router;
