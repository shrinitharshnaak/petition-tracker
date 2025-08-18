const express = require("express");
const router = express.Router();
const Petition = require("../models/Petition");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

// GET all petitions
router.get("/petitions", verifyToken, async (req, res) => {
  try {
    const petitions = await Petition.find().sort({ createdAt: -1 });
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET petitions by citizen
router.get("/petitions/citizen/:id", verifyToken, async (req, res) => {
  try {
    const petitions = await Petition.find({ creator: req.params.id }).sort({ createdAt: -1 });
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE petition
router.post("/petitions", verifyToken, async (req, res) => {
  try {
    const { title, description, state } = req.body;
    const creator = req.user.id; // use token user id

    if (!title || !description || !state) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const petition = new Petition({ title, description, state, creator });
    await petition.save();
    res.status(201).json(petition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DASHBOARD STATS
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const totalPetitions = await Petition.countDocuments();
    const solvedPetitions = await Petition.countDocuments({ status: "Resolved" });
    const welfareIndex = totalPetitions ? Math.round((solvedPetitions / totalPetitions) * 100) : 0;
    res.json({ totalPetitions, solvedPetitions, welfareIndex });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LEADERBOARD
router.get("/leaderboard", verifyToken, async (req, res) => {
  try {
    const leaderboard = await Petition.aggregate([
      { $match: { status: "Resolved" } },
      { $group: { _id: "$creator", solvedCount: { $sum: 1 } } },
      { $sort: { solvedCount: -1 } },
      { $limit: 10 },
    ]);

    const result = await Promise.all(
      leaderboard.map(async (l) => {
        const user = await User.findById(l._id);
        return {
          name: user ? user.name : "Unknown",
          role: user ? user.role : "citizen",
          solvedCount: l.solvedCount,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PETITION STATUS
router.put("/petitions/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const petition = await Petition.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!petition) return res.status(404).json({ error: "Petition not found" });

    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ESCALATE PETITION
router.put("/petitions/:id/escalate", verifyToken, async (req, res) => {
  try {
    const { rulingPartyId } = req.body;
    if (!rulingPartyId) return res.status(400).json({ error: "Ruling Party ID required" });

    const petition = await Petition.findByIdAndUpdate(
      req.params.id,
      { status: "Escalated", escalatedTo: rulingPartyId },
      { new: true }
    );

    if (!petition) return res.status(404).json({ error: "Petition not found" });

    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
