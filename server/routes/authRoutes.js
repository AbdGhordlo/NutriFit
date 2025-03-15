const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Public routes
const { signup, login, deleteAccount } = require('../controllers/authController');
const passport = require('passport');

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to the frontend
    res.redirect('http://localhost:5173/home');
  }
);

router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.delete('/:userId', auth, deleteAccount);

module.exports = router;