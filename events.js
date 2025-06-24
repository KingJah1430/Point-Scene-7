
const express = require('express');
const Match = require('../models/Match');
const Bet = require('../models/Bet');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.get('/events/:sport', async (req, res) => {
  const events = await Match.find({ sport: req.params.sport });
  res.json(events);
});

router.get('/match/:id', async (req, res) => {
  const match = await Match.findById(req.params.id);
  res.json(match);
});

router.post('/bets', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });
  const userId = jwt.verify(token, JWT_SECRET).id;
  const { matchId, outcome, amount } = req.body;
  const bet = new Bet({ userId, matchId, outcome, amount });
  await bet.save();
  res.json({ msg: 'Bet placed', bet });
});

router.get('/user/wallet', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });
  const userId = jwt.verify(token, JWT_SECRET).id;
  const user = await User.findById(userId);
  res.json({ balance: user.wallet });
});

router.put('/user/wallet', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });
  const userId = jwt.verify(token, JWT_SECRET).id;
  const { amount } = req.body;
  const user = await User.findById(userId);
  if (user.wallet < amount) return res.status(400).json({ msg: 'Insufficient balance' });
  user.wallet -= amount;
  await user.save();
  res.json({ msg: 'Wallet updated', balance: user.wallet });
});

router.get('/user/bets', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });
  const userId = jwt.verify(token, JWT_SECRET).id;
  const bets = await Bet.find({ userId }).populate('matchId');
  res.json(bets);
});

module.exports = router;
