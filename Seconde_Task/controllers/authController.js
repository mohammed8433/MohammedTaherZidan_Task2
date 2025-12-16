// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc Display Registration Form
// @route GET /auth/register
exports.registerForm = (req, res) => {
  res.render('auth/register');
};

// @desc Register User
// @route POST /auth/register
exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Create the user
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    // 3. Log user in by setting session
    req.session.userId = user._id;

    res.redirect('/students');
  } catch (error) {
    console.error(error);
    res.render('auth/register', { error: 'Registration failed. Username might be taken.' });
  }
};

// @desc Display Login Form
// @route GET /auth/login
exports.loginForm = (req, res) => {
  // Use the 'redirect' query parameter for post-login navigation
  const redirect = req.query.redirect || '/students';
  res.render('auth/login', { redirect });
};

// @desc Login User
// @route POST /auth/login
exports.login = async (req, res) => {
  const { username, password, redirect } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid Credentials', redirect });
    }

    // 1. Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // 2. Set session and redirect
      req.session.userId = user._id;
      res.redirect(redirect || '/students');
    } else {
      return res.render('auth/login', { error: 'Invalid Credentials', redirect });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// @desc Logout User
// @route GET /auth/logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/students');
    res.redirect('/auth/login');
  });
};