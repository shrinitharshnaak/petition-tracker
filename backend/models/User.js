const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['citizen', 'party', 'admin'], default: 'citizen' },
  state: String,
});
module.exports = mongoose.model('User', userSchema);
