const express = require('express');
const { signup, login } = require('../controllers/authController');
const passport = require('passport');
const router = express.Router();

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

module.exports = router;