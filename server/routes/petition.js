const router = require('express').Router();
const Petition = require('../models/Petition');
const { verifyToken, requireRole } = require('../middleware/auth');

// Citizen: Submit petition
router.post('/submit', verifyToken, requireRole('citizen'), async (req, res) => {
  try {
    const { title, description, state } = req.body;

    const petition = new Petition({
      title,
      description,
      state,
      createdBy: req.user.id
    });

    await petition.save();
    res.status(201).json({ message: 'Petition submitted successfully', petition });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting petition', error: err.message });
  }
});
// 📄 View all petitions (public route)
router.get('/all', async (req, res) => {
  try {
    const petitions = await Petition.find().sort({ createdAt: -1 });
    res.json({ petitions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch petitions', error: err.message });
  }
});
//sign a petition
router.put('/:id/sign', verifyToken, requireRole('citizen'), async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Prevent duplicate signing
    if (petition.signedBy.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already signed this petition' });
    }

    petition.signatures += 1;
    petition.signedBy.push(req.user.id);
    await petition.save();

    res.json({ message: 'Petition signed successfully', petition });
  } catch (err) {
    res.status(500).json({ message: 'Error signing petition', error: err.message });
  }
});

// 👤 Get petitions submitted by the logged-in citizen
router.get('/mine', verifyToken, requireRole('citizen'), async (req, res) => {
  try {
    const petitions = await Petition.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ petitions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch your petitions', error: err.message });
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



module.exports = router;
