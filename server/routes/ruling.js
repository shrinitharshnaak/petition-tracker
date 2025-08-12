const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const Petition = require('../models/Petition');

// 🏛️ Ruling Party: View petitions from their own state
router.get('/petitions', verifyToken, requireRole('ruling'), async (req, res) => {
  try {
    const petitions = await Petition.find({ state: req.user.state }).sort({ createdAt: -1 });
    res.json({ petitions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch petitions', error: err.message });
  }
});

module.exports = router;
