const mongoose = require("mongoose");

const PetitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    state: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "In-Progress", "Resolved", "Closed", "Escalated"],
      default: "Active",
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // party currently handling
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ruling party if escalated
    signatureCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Petition", PetitionSchema);
