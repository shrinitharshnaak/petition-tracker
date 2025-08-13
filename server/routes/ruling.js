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
// 🟢 Mark a petition as solved (Ruling Party only)
router.put('/petitions/:id/solve', verifyToken, requireRole('ruling'), async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Only allow solving petitions in the ruling party's state
    if (petition.state !== req.user.state) {
      return res.status(403).json({ message: 'You cannot solve petitions outside your state' });
    }

    petition.status = 'Solved';
    await petition.save();

    res.json({ message: 'Petition marked as solved successfully', petition });
  } catch (err) {
    res.status(500).json({ message: 'Failed to solve petition', error: err.message });
  }
});
// 📊 State Welfare Index for Ruling Party
router.get('/dashboard', verifyToken, requireRole('ruling'), async (req, res) => {
  try {
    const state = req.user.state;

    const totalPetitions = await Petition.countDocuments({ state });
    const activePetitions = await Petition.countDocuments({ state, status: 'Active' });
    const solvedPetitions = await Petition.countDocuments({ state, status: 'Solved' });

    const petitions = await Petition.find({ state }, 'signatures');
    const totalSignatures = petitions.reduce((sum, p) => sum + p.signatures, 0);

    res.json({
      state,
      totalPetitions,
      activePetitions,
      solvedPetitions,
      totalSignatures
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching state dashboard', error: err.message });
  }
});


module.exports = router;
