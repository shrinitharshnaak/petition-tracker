const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'party', 'ruling', 'citizen'], 
    default: 'citizen' 
  },
  state: { type: String, required: true }, // 🟢 This line enables state filtering
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
