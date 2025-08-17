// routes/leaderboard.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

// 📌 Get leaderboard (ruling + nonruling parties sorted by reputation)
router.get("/", verifyToken, async (req, res) => {
  try {
    const parties = await User.find({
      role: { $in: ["rulingparty", "nonrulingparty"] },
    })
      .select("name role state reputation")
      .sort({ reputation: -1 }); // highest first

    res.json({ leaderboard: parties });
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
  }
});

module.exports = router;
