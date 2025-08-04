const mongoose = require('mongoose');

const petitionSchema = new mongoose.Schema({
  title: String,
  description: String,
  state: String,
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolved: { type: Boolean, default: false },
  resolutionNotes: String,
  submittedAt: { type: Date, default: Date.now },
  resolvedAt: Date
});

module.exports = mongoose.model('Petition', petitionSchema);
