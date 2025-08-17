// server/routes/petition.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Petition = require("../models/Petition");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const PARTY_ROLES = new Set(["rulingparty", "nonrulingparty"]);
const ALLOWED_STATUSES = new Set(["Active", "Solved", "Reopened"]);

// reputation increments (tune as you like)
const REP_INC = {
  rulingparty: 5,
  nonrulingparty: 3,
};
// Route to get petitions created by this user
router.get('/my-owned', verifyToken, async (req, res) => {
  const petitions = await Petition.find({ createdBy: req.user.id });
  res.json({ petitions });
});

// Escalate (non-ruling)
router.put('/:id/escalate', verifyToken, async (req, res) => {
  if (req.user.role !== 'nonrulingparty') {
    return res.status(403).json({ message: 'Only non-ruling can escalate' });
  }
  const petition = await Petition.findById(req.params.id);
  petition.status = 'Escalated';
  await petition.save();
  // update nonruling reputation
  const user = await User.findById(req.user.id);
  user.reputation += 1;
  await user.save();
  res.json({ message: 'Petition escalated' });
});

// Solve (ruling party)
router.put('/:id/solve', verifyToken, async (req, res) => {
  if (req.user.role !== 'rulingparty') {
    return res.status(403).json({ message: 'Only ruling can mark solved' });
  }
  const petition = await Petition.findById(req.params.id);
  petition.status = 'Solved';
  await petition.save();
  // increase reputation
  const user = await User.findById(req.user.id);
  user.reputation += 2;
  await user.save();
  res.json({ message: 'Petition marked as solved' });
});


/* ------------------------------------------------------------------
   Create a petition (citizens create; we read state from user securely)
------------------------------------------------------------------- */
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const user = await User.findById(req.user.id).select("state");
    if (!user || !user.state) {
      return res.status(400).json({ message: "User state not found" });
    }

    const petition = await Petition.create({
      title: title.trim(),
      description: description.trim(),
      state: user.state,
      status: "Active",
      signatures: 0,
      signedBy: [],
      createdBy: req.user.id,
    });

    res.json({ message: "Petition submitted successfully", petition });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting petition", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Get petitions for logged-in user's state (SECURE)
   (this fixes the 400 you saw earlier)
------------------------------------------------------------------- */
router.get("/my-state", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("state");
    if (!user || !user.state) {
      return res.status(400).json({ message: "User state not found" });
    }

    const { q, status, page = 1, limit = 10 } = req.query;
    const filter = { state: user.state };

    if (status && ALLOWED_STATUSES.has(status)) {
      filter.status = status;
    }

    if (q && q.trim()) {
      filter.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Petition.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "name role state"),
      Petition.countDocuments(filter),
    ]);

    res.json({
      petitions: items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching state petitions", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Public list (admin-style; can be used for super dashboards)
------------------------------------------------------------------- */
router.get("/", verifyToken, async (req, res) => {
  try {
    // Only admin can see all by default; relax if you want
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { q, status, state, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (state) filter.state = state;
    if (status && ALLOWED_STATUSES.has(status)) filter.status = status;

    if (q && q.trim()) {
      filter.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { description: { $regex: q.trim(), $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Petition.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "name role state"),
      Petition.countDocuments(filter),
    ]);

    res.json({
      petitions: items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching petitions", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Get one petition by id (must belong to user.state unless admin)
------------------------------------------------------------------- */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid petition id" });
    }

    const petn = await Petition.findById(id).populate(
      "createdBy signedBy",
      "name role state"
    );
    if (!petn) return res.status(404).json({ message: "Petition not found" });

    if (req.user.role !== "admin") {
      const me = await User.findById(req.user.id).select("state");
      if (!me || !me.state || me.state !== petn.state) {
        return res.status(403).json({ message: "Forbidden for this state" });
      }
    }

    res.json({ petition: petn });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching petition", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Sign a petition (citizens/any logged-in; prevent duplicates)
------------------------------------------------------------------- */
router.put("/:id/sign", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid petition id" });
    }

    const me = await User.findById(req.user.id).select("state");
    if (!me || !me.state) {
      return res.status(400).json({ message: "User state not found" });
    }

    const petition = await Petition.findById(id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    // state restriction
    if (petition.state !== me.state && req.user.role !== "admin") {
      return res.status(403).json({ message: "Cannot sign outside your state" });
    }

    // prevent duplicate
    if (petition.signedBy.some((u) => String(u) === String(req.user.id))) {
      return res.status(400).json({ message: "You already signed this petition" });
    }

    petition.signedBy.push(req.user.id);
    petition.signatures = (petition.signatures || 0) + 1;
    await petition.save();

    res.json({ message: "Petition signed successfully", petition });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error signing petition", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Unsign a petition (optional)
------------------------------------------------------------------- */
router.put("/:id/unsign", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid petition id" });
    }

    const petition = await Petition.findById(id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    const wasSigned = petition.signedBy.some(
      (u) => String(u) === String(req.user.id)
    );
    if (!wasSigned) {
      return res.status(400).json({ message: "You have not signed this petition" });
    }

    petition.signedBy = petition.signedBy.filter(
      (u) => String(u) !== String(req.user.id)
    );
    petition.signatures = Math.max(0, (petition.signatures || 0) - 1);
    await petition.save();

    res.json({ message: "Signature removed", petition });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error unsigning petition", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Solve a petition (ruling/non-ruling only) + reputation score
------------------------------------------------------------------- */
router.put("/:id/solve", verifyToken, async (req, res) => {
  try {
    if (!PARTY_ROLES.has(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Only parties can mark petitions as solved" });
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid petition id" });
    }

    const actor = await User.findById(req.user.id).select("state role reputation");
    if (!actor || !actor.state) {
      return res.status(400).json({ message: "User state not found" });
    }

    const petition = await Petition.findById(id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    // state restriction
    if (petition.state !== actor.state && req.user.role !== "admin") {
      return res.status(403).json({ message: "Cannot solve outside your state" });
    }

    petition.status = "Solved";
    await petition.save();

    // reputation score
    const inc = REP_INC[req.user.role] || 1;
    actor.reputation = (actor.reputation || 0) + inc;
    await actor.save();

    res.json({
      message: "Petition marked as solved",
      petition,
      reputation: actor.reputation,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error solving petition", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Reopen a petition (admin)
------------------------------------------------------------------- */
router.put("/:id/reopen", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid petition id" });
    }

    const petition = await Petition.findById(id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    petition.status = "Reopened";
    await petition.save();

    res.json({ message: "Petition reopened", petition });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error reopening petition", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Edit a petition (creator or admin; optional restriction)
------------------------------------------------------------------- */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid petition id" });
    }

    const petition = await Petition.findById(id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    if (
      String(petition.createdBy) !== String(req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this petition" });
    }

    if (title) petition.title = title.trim();
    if (description) petition.description = description.trim();

    await petition.save();
    res.json({ message: "Petition updated", petition });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating petition", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Delete a petition (creator or admin)
------------------------------------------------------------------- */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid petition id" });
    }

    const petition = await Petition.findById(id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    if (
      String(petition.createdBy) !== String(req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this petition" });
    }

    await petition.deleteOne();
    res.json({ message: "Petition deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting petition", error: err.message });
  }
});

/* ------------------------------------------------------------------
   State stats (for dashboard cards): totals, active, solved, signatures
   - Admin can query any state
   - Others only their own state
------------------------------------------------------------------- */
router.get("/stats/summary", verifyToken, async (req, res) => {
  try {
    let { state } = req.query;

    if (req.user.role !== "admin") {
      // force to user's own state
      const me = await User.findById(req.user.id).select("state");
      state = me?.state || state;
    }

    if (!state) {
      return res.status(400).json({ message: "State parameter required" });
    }

    const base = { state };

    const [total, active, solved, reopened, signaturesAgg] = await Promise.all([
      Petition.countDocuments(base),
      Petition.countDocuments({ ...base, status: "Active" }),
      Petition.countDocuments({ ...base, status: "Solved" }),
      Petition.countDocuments({ ...base, status: "Reopened" }),
      Petition.aggregate([
        { $match: base },
        { $group: { _id: null, sum: { $sum: "$signatures" } } },
      ]),
    ]);

    const signatures = signaturesAgg[0]?.sum || 0;

    res.json({
      state,
      total,
      active,
      solved,
      reopened,
      signatures,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: err.message });
  }
});

/* ------------------------------------------------------------------
   Top petitions by signatures (per state)
------------------------------------------------------------------- */
router.get("/stats/top", verifyToken, async (req, res) => {
  try {
    let { state, limit = 5 } = req.query;
    limit = Number(limit);

    if (req.user.role !== "admin") {
      const me = await User.findById(req.user.id).select("state");
      state = me?.state || state;
    }

    if (!state) {
      return res.status(400).json({ message: "State parameter required" });
    }

    const items = await Petition.find({ state })
      .sort({ signatures: -1 })
      .limit(limit)
      .select("title signatures status state createdAt");

    res.json({ state, items });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching top petitions", error: err.message });
  }
});

module.exports = router;
