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
// 📊 Admin Dashboard Stats
router.get('/dashboard', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const totalPetitions = await Petition.countDocuments();
    const activePetitions = await Petition.countDocuments({ status: 'Active' });
    const solvedPetitions = await Petition.countDocuments({ status: 'Solved' });

    // Count total signatures
    const petitions = await Petition.find({}, 'signatures');
    const totalSignatures = petitions.reduce((sum, p) => sum + p.signatures, 0);

    res.json({
      totalPetitions,
      activePetitions,
      solvedPetitions,
      totalSignatures
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
});


module.exports = router;
