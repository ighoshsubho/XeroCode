const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Signup route
router.post('/signup', authController.signup);

// Signin route
router.post('/signin', authController.signin);

// Google OAuth route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GitHub OAuth route
router.get('/auth/github', passport.authenticate('github'));

// Callback route for Google OAuth
router.get('/auth/google/callback', authController.googleAuthCallback);

// Callback route for GitHub OAuth
router.get('/auth/github/callback', authController.githubAuthCallback);

module.exports = router;