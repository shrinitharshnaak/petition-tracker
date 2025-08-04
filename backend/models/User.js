const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['citizen', 'party', 'admin'], default: 'citizen' },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
