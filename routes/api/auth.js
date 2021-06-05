const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth') ///тут знаходиться мыдлвейр, який ми передаэмо ще й у запрос

const User = require('../../models/User')

// @route   GET api/auth
// @desc    Tests users route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error')
    }
});



module.exports = router;
