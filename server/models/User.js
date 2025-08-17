// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["citizen", "rulingparty", "nonrulingparty", "admin"],
      default: "citizen",
    },
    state: { type: String, required: true },

    // ✅ Reputation score for parties
    reputation: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
