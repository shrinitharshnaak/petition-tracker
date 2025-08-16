const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Import verifyToken in case we need protected routes
const { verifyToken } = require("../middleware/auth");

// 📌 Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role, state } = req.body;

    // Validate fields
    if (!email || !password || !name || !role || !state) {
      return res
        .status(400)
        .json({ message: "All fields (name, email, password, role, state) are required" });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ email, password: hashed, name, role, state });
    await user.save();

    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Register error", error: err.message });
  }
});

// 📌 Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role, state: user.state },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role, state: user.state });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
});

// 📌 Get logged-in user profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

module.exports = router;
