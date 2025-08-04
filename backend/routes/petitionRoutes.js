const express = require('express');
const router = express.Router();
const Petition = require('../models/Petition');

// Submit petition
router.post('/', async (req, res) => {
  try {
    const petition = new Petition(req.body);
    await petition.save();
    res.status(201).json(petition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all petitions
router.get('/', async (req, res) => {
  const petitions = await Petition.find().populate('submittedBy assignedTo');
  res.json(petitions);
});

// Resolve petition
router.put('/:id/resolve', async (req, res) => {
  const petition = await Petition.findByIdAndUpdate(
    req.params.id,
    {
      resolved: true,
      resolvedAt: new Date(),
      resolutionNotes: req.body.resolutionNotes,
    },
    { new: true }
  );
  res.json(petition);
});

// Get stats
router.get('/stats', async (req, res) => {
  const total = await Petition.countDocuments();
  const resolved = await Petition.countDocuments({ resolved: true });
  const petitions = await Petition.find({ resolved: true });

  const avgResponseTime = petitions.length > 0
    ? petitions.reduce((acc, p) => acc + (new Date(p.resolvedAt) - new Date(p.submittedAt)), 0) / petitions.length / (1000 * 60 * 60 * 24)
    : 0;

  res.json({ total, resolved, avgResponseTime: avgResponseTime.toFixed(2) });
});

module.exports = router;
