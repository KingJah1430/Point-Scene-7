
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed, username });
  await user.save();
  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token, email: user.email, username: user.username });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token, email: user.email, username: user.username });
});

router.put('/profile', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });
  const userId = jwt.verify(token, JWT_SECRET).id;
  const { username } = req.body;
  const user = await User.findById(userId);
  user.username = username;
  await user.save();
  res.json({ msg: 'Profile updated', username });
});

module.exports = router;
