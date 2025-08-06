const mongoose = require('mongoose');

const PetitionSchema = new mongoose.Schema({
  title: String,
  description: String,
  state: String,
  status: { type: String, enum: ['active', 'solved', 'escalated'], default: 'active' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  resolution: String
}, { timestamps: true });

module.exports = mongoose.model('Petition', PetitionSchema);

// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ['citizen', 'party', 'admin'], default: 'citizen' }
});

module.exports = mongoose.model('User', UserSchema);