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




module.exports = router;
