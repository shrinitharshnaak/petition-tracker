// routes/user.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Petition = require("../models/Petition");
const { verifyToken } = require("../middleware/auth");


// GET /api/user/profile/:id -> profile w/ reputation & solved counts
router.get("/profile/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user id" });

    const user = await User.findById(id).select("name email role state reputation createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    const solvedCount = await Petition.countDocuments({ solvedBy: id, status: "Solved" });
    const escalatedSolvedCount = await Petition.countDocuments({ solvedBy: id, status: "Solved" }).where("status").equals("Solved"); // same in this schema

    res.json({
      user,
      metrics: {
        issuesSolved: solvedCount,
        escalatedSolved: escalatedSolvedCount
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

module.exports = router;
