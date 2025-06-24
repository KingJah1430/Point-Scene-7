
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  wallet: { type: Number, default: 100.00 }
});

module.exports = mongoose.model('User', userSchema);
