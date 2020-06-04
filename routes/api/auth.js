const express = require('express');
const router = express.Router();
const auth = require('../../middlleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs')

// @route     GET api/auth
// @desc      Test route
// @access   Public
router.get('/', auth, async (req, res) => {

  // return the user data once he register
  try {
    const user = await User.findById(req.user.id).select('-password')

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error :( ')
  }
});

// @route     POST api/auth
// @desc      authenticate user & get token 
// @access   Public
router.post('/',
  [
    check('email', 'Please, include a valid email').isEmail(),
    check(
      'password',
      'Paswword is required '
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // if there any errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // check if there is no user
      let user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentioals' }] });
      }

      // get the payload
      const payload = {
        user: {
          id: user.id
        }
      }

      // compair the register email and password with the loged one
      const isPasswordMatch = await bcrypt.compare(password, user.password)

      if (!isPasswordMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentioals' }] });
      }

      // return the jsonwebtoken once the user register
      jwt.sign(payload, config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        })

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error :( ');
    }
  }
);

module.exports = router;
