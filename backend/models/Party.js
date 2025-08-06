const mongoose = require('mongoose');

const PartySchema = new mongoose.Schema({
  name: String,
  isRuling: Boolean,
  reputation: { type: Number, default: 0 },
  state: String
});

module.exports = mongoose.model('Party', PartySchema);
