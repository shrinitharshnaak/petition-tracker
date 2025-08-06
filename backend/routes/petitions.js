const express = require('express');
const Petition = require('../models/Petition');
const Party = require('../models/Party');
const router = express.Router();

router.post('/', async (req, res) => {
  const newPetition = new Petition(req.body);
  await newPetition.save();
  res.status(201).json(newPetition);
});

router.get('/stats', async (req, res) => {
  const total = await Petition.countDocuments();
  const solved = await Petition.countDocuments({ status: 'solved' });
  const active = await Petition.countDocuments({ status: 'active' });
  const index = ((solved / total) * 100).toFixed(2);
  res.json({ total, solved, active, welfareIndex: index });
});

router.put('/:id/resolve', async (req, res) => {
  const petition = await Petition.findById(req.params.id);
  petition.status = 'solved';
  petition.resolution = req.body.resolution;
  await petition.save();

  const party = await Party.findById(petition.assignedTo);
  party.reputation += 10;
  await party.save();

  res.json(petition);
});

module.exports = router;
