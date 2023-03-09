const express = require('express');
const User = require('../models/user');
const Match = require('../models/match');

const router = express.Router();

// Get matches for a user
router.get('/api/matches', async (req, res) => {
  try {
    const matches = await Match.find({ user: req.user._id }).populate('user');
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// Like a user
router.post('/api/likes', async (req, res) => {
  try {
    const { likedUser } = req.body;
    const existingMatch = await Match.findOne({
      $or: [
        { user: req.user._id, likedUser },
        { user: likedUser, likedUser: req.user._id }
      ]
    });

    if (existingMatch) {
      return res.status(400).json({ error: 'Match already exists' });
    }

    const match = new Match({
      user: req.user._id,
      likedUser
    });
    await match.save();

    // Add liked user to current user's users_liked array
    const currentUser = await User.findById(req.user._id);
    currentUser.users_liked.push(likedUser);
    await currentUser.save();

    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to like user' });
  }
});


// // Search for users
// router.get('/api/users/search/:id', async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.params.id);
//     if (!currentUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Find all users in the same region as the current user
//     const users = await User.find({ region: currentUser.region });

//     // Filter out the current user
//     const filteredUsers = users.filter((user) => user._id.toString() !== currentUser._id.toString());

//     // Filter out users who don't have at least one role in common with the current user's interests
//     const usersWithCommonRoles = filteredUsers.filter(
//       (user) =>
//         user.roles_interested_in.filter((role) =>
//           currentUser.interested_in_roles.includes(role)
//         ).length > 0 ||
//         currentUser.roles.filter((role) =>
//           user.roles_interested_in.includes(role)
//         ).length > 0
//     );

//     // Filter out users whose content doesn't overlap with the current user's content
//     const usersWithMatchingContent = usersWithCommonRoles.filter(
//       (user) =>
//         user.content.match(new RegExp(currentUser.content, 'i')) ||
//         currentUser.content.match(new RegExp(user.content, 'i'))
//     );

//     res.json(usersWithMatchingContent);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to search for users' });
//   }
// });




module.exports = router;
