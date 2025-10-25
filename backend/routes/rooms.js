const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Room = require('../models/Room');

// list public rooms
router.get('/', auth, async (req, res) => {
  const rooms = await Room.find({ isPrivate: false }).limit(50);
  res.json(rooms);
});

// create a room
router.post('/', auth, async (req, res) => {
  const { name, isPrivate } = req.body;
  const room = await Room.create({ name, isPrivate, members: isPrivate ? [req.user.id] : [] });
  res.json(room);
});

module.exports = router;
