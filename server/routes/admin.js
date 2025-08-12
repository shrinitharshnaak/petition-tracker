const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const Petition = require('../models/Petition');

router.get('/dashboard', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const total = await Petition.countDocuments();
    const active = await Petition.countDocuments({ status: 'Active' });
    const solved = await Petition.countDocuments({ status: 'Solved' });

    const petitions = await Petition.find();
    const totalSignatures = petitions.reduce((sum, p) => sum + p.signatures, 0);

    res.json({
      totalPetitions: total,
      activePetitions: active,
      solvedPetitions: solved,
      totalSignatures
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading dashboard', error: err.message });
  }
});

module.exports = router;
