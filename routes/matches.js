const express = require('express');
const User = require('../models/user');
const Match = require('../models/match');

const router = express.Router();

// Get matches for a user
router.get('/api/users/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('liked_users');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matches = user.liked_users.filter((likedUser) => {
      return likedUser.liked_users.includes(user._id);
    });

    res.status(200).json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a match by id
router.patch('/api/users/unmatch/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.liked_users = user.liked_users.filter((likedUser) => String(likedUser) !== userId);
    await user.save();

    res.status(200).json({ message: 'User unliked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});






module.exports = router;
