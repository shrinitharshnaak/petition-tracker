const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  state: { type: String, required: true },
  status: { type: String, enum: ["Active", "Solved", "Escalated"], default: "Active" },
  signatures: { type: Number, default: 0 },
  signedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  solvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Petition", petitionSchema);
