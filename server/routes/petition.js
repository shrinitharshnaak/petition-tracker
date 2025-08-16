const express = require("express");
const router = express.Router();
const Petition = require("../models/Petition");
const { verifyToken } = require("../middleware/auth");
const User = require("../models/User");

// 📌 Create a petition
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.state) {
      return res.status(400).json({ message: "User state not found" });
    }

    const petition = new Petition({
      title,
      description,
      state: user.state, // 🔑 auto-assign from user
      createdBy: user._id,
    });

    await petition.save();
    res.json({ message: "Petition submitted successfully", petition });
  } catch (err) {
    res.status(500).json({ message: "Error submitting petition", error: err.message });
  }
});

// 📌 Get all petitions (admin use)
router.get("/", async (req, res) => {
  try {
    const petitions = await Petition.find().populate("createdBy", "name email state");
    res.json({ petitions });
  } catch (err) {
    res.status(500).json({ message: "Error fetching petitions", error: err.message });
  }
});

// 📌 Get petitions for logged-in user's state
router.get("/my-state", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.state) {
      return res.status(400).json({ message: "User state not found" });
    }

    const petitions = await Petition.find({ state: user.state }).populate("createdBy", "name");
    res.json({ petitions });
  } catch (err) {
    res.status(500).json({ message: "Error fetching state petitions", error: err.message });
  }
});

// 📌 Sign a petition
router.put("/:id/sign", verifyToken, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    if (petition.signedBy.includes(req.user.id)) {
      return res.status(400).json({ message: "You already signed this petition" });
    }

    petition.signatures += 1;
    petition.signedBy.push(req.user.id);
    await petition.save();

    res.json({ message: "Petition signed successfully", petition });
  } catch (err) {
    res.status(500).json({ message: "Error signing petition", error: err.message });
  }
});

// 📌 Solve a petition (ruling & non-ruling parties)
router.put("/:id/solve", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "rulingparty" && req.user.role !== "nonrulingparty") {
      return res.status(403).json({ message: "Only parties can solve petitions" });
    }

    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    petition.status = "Solved";
    await petition.save();

    res.json({ message: "Petition marked as solved", petition });
  } catch (err) {
    res.status(500).json({ message: "Error solving petition", error: err.message });
  }
});

// 📌 Delete a petition (optional, only creator or admin)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    if (petition.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this petition" });
    }

    await petition.deleteOne();
    res.json({ message: "Petition deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting petition", error: err.message });
  }
});

module.exports = router;
