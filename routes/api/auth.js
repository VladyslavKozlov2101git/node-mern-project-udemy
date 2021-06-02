const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Auth Works' }));

module.exports = router;
