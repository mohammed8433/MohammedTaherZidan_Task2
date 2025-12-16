// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: { // Storing the hashed password
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);