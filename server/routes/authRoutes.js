const express = require('express');
const auth = require('../middleware/auth');
const { signup, login, googleAuth, deleteAccount } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// Protected routes
router.delete('/:userId', auth, deleteAccount);
router.post('/google', googleAuth); 

module.exports = router;