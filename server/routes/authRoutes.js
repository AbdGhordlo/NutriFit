const express = require('express');
const { signup, login, googleAuth } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth); // Add this new route

module.exports = router;