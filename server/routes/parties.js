const express = require("express");
const router = express.Router();
const Party = require("../models/Party");
const { verifyToken } = require("../middleware/auth");

// ---------------------------- Routes ----------------------------

// ✅ Get all parties
router.get("/", verifyToken, async (req, res) => {
  try {
    const parties = await Party.find({});
    res.json(parties);
  } catch (err) {
    console.error("Fetch parties error:", err);
    res.status(500).json({ message: "Failed to fetch parties" });
  }
});

// ✅ Get party by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ message: "Party not found" });

    // Include rulingPartyId for nonruling parties
    const response = {
      _id: party._id,
      name: party.name,
      state: party.state,
      role: party.role,
      reputationScore: party.reputationScore || 0,
      rulingPartyId: party.rulingPartyId || null, // for escalation
    };

    res.json(response);
  } catch (err) {
    console.error("Fetch party error:", err);
    res.status(500).json({ message: "Failed to fetch party" });
  }
});

// ✅ Update party info (optional, admin only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!party) return res.status(404).json({ message: "Party not found" });
    res.json(party);
  } catch (err) {
    console.error("Update party error:", err);
    res.status(500).json({ message: "Failed to update party" });
  }
});

module.exports = router;
