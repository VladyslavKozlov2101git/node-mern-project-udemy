const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');

const User = require('../../models/User')

// @route   POST api/users/test
// @desc    Register user
// @access  Public
router.post('/',
[
    check('name', 'Name is required') // Field and message
        .not()
        .isEmpty(),
    check('email', 'Please include a valis email') 
        .isEmail(),
    check('password', 'Please enter the password with 6 or more characters') 
        .isLength({"min":6})
],
    

    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    console.log(res.body)


    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
      })

      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt); // хеширование пароля с помощью соли

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '360000' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }

    



    
});

module.exports = router;