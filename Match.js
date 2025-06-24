
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: String,
  teamA: String,
  teamB: String,
  date: Date,
  odds: Object
});

module.exports = mongoose.model('Match', matchSchema);
