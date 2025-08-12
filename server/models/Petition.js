const mongoose = require('mongoose');

const PetitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  state: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Solved'], default: 'Active' },
  signatures: { type: Number, default: 0 },
  signedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Petition', PetitionSchema);
