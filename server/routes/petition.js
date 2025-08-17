const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Petition = require("../models/Petition");
const Party = require("../models/Party");
const { verifyToken } = require("../middleware/auth");

// ---------------------------- Config ----------------------------
const VALID_STATUS = ["Active", "In-Progress", "Resolved", "Closed", "Escalated"];
const REPUTATION_POINTS = {
  PICKED_UP: 2,
  RESOLVED: 5,
};

// ---------------------------- Helper ----------------------------
async function bumpPartyReputation(partyId, points) {
  const party = await Party.findById(partyId);
  if (!party) return;
  if (typeof party.reputationScore !== "number") party.reputationScore = 0;
  party.reputationScore += points;
  await party.save();
}

// ---------------------------- Routes ----------------------------

// ✅ Citizen Routes
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, state } = req.body;
    const petition = new Petition({ title, description, state, creator: req.user.id });
    await petition.save();
    res.status(201).json(petition);
  } catch (err) {
    res.status(500).json({ message: "Failed to create petition" });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const petitions = await Petition.find({})
      .populate("creator", "name")
      .populate("handledBy", "name");
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch petitions" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid petition ID" });

  const petition = await Petition.findById(req.params.id)
    .populate("creator", "name")
    .populate("handledBy", "name");
  if (!petition) return res.status(404).json({ message: "Not found" });
  res.json(petition);
});

// ---------------- nonruling Routes ----------------
router.get("/state/:state", verifyToken, async (req, res) => {
  try {
    const petitions = await Petition.find({
      state: req.params.state,
      status: { $in: ["Active", "In-Progress"] },
    }).sort({ createdAt: -1 });
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching petitions" });
  }
});

// ---------------- Ruling / nonruling Status Update ----------------
router.put("/status/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: "Invalid petition ID" });

    if (!VALID_STATUS.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Not found" });

    petition.status = status;
    petition.handledBy = req.user.id;

    // Reputation points
    if (status === "In-Progress") await bumpPartyReputation(req.user.id, REPUTATION_POINTS.PICKED_UP);
    if (status === "Resolved") await bumpPartyReputation(req.user.id, REPUTATION_POINTS.RESOLVED);

    await petition.save();
    res.json({ message: "Status updated", petition });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// ---------------- Delete Petition ----------------
router.delete("/:id", verifyToken, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid petition ID" });

  const petition = await Petition.findByIdAndDelete(req.params.id);
  if (!petition) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted successfully" });
});

// ---------------- Stats & Leaderboard ----------------
router.get("/stats/all", verifyToken, async (req, res) => {
  try {
    const total = await Petition.countDocuments();
    const active = await Petition.countDocuments({ status: "Active" });
    const solved = await Petition.countDocuments({ status: "Resolved" });
    const signaturesAgg = await Petition.aggregate([{ $group: { _id: null, total: { $sum: "$signatureCount" } } }]);
    const signatures = signaturesAgg[0]?.total || 0;
    res.json({ total, active, solved, signatures });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.get("/leaderboard", verifyToken, async (req, res) => {
  try {
    const parties = await Party.find({}).sort({ reputationScore: -1 }).limit(10);
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
