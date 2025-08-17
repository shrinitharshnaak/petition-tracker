const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["ruling", "nonruling"], required: true },
  reputationScore: { type: Number, default: 0 },
});

module.exports = mongoose.model("Party", partySchema);
