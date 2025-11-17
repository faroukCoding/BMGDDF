const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/auth/me
// @desc    Get current user's data
// @access  Private
router.get('/me', protect, (req, res) => {
  // This is a protected route. req.user is available here.
  res.json({ msg: 'This is a protected route!', user: req.user });
});

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

module.exports = router;
