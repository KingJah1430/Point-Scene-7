
const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  outcome: String,
  amount: Number,
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Bet', betSchema);
