const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { hashPassword } = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router()
const MatchModel = require('../models/match')

router.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, username, server, roles, content, interested_in_roles } = req.body;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({ name, email, password: hashedPassword, username, server, roles, content, interested_in_roles });

    // Save user to database
    const savedUser = await user.save();
    

    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare the password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token with the user ID
    const token = jwt.sign({ userId: user._id }, 'secret');

    // Send the token in the response
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Check if username already exists
router.get('/api/users/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    res.json({ exists: user !== null });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.put('/api/users/:username/preferences', (req, res) => {
  const { server, roles, content, interested_in_roles } = req.body
  const username = req.params.username;

  // Update user preferences in database
  User.findOneAndUpdate({ username }, { server, roles, content, interested_in_roles }, { new: true })
    .then(updatedUser => {
      res.status(200).json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user preferences' });
    });
});

router.patch('/api/users/:username/password', async (req, res) => {
  const { username } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username }).select('+password');

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid current password' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password in database
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.sendStatus(204); // Success, no content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user password' });
  }
});


// API to delete active user with password authentication
router.delete('/api/users/me', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username }).select('+password');

    // Verify password
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Delete user from database
    await User.findOneAndDelete({ username });

    // Remove user's ID from matches they were in
    await MatchModel.updateMany(
      { users: user._id },
      { $pull: { users: user._id } }
    );

    res.sendStatus(204); // Success, no content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user profile' });
  }  
});


router.get('/api/users/:username/details', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { _id, server, roles, interested_in_roles, content } = user;
    res.json({ _id, username, server, roles, interested_in_roles, content });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/api/users/search/:id', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all users in the same region as the current user
    const users = await User.find({ server: currentUser.server });

    // Filter out the current user
    const filteredUsers = users.filter((user) => user._id.toString() !== currentUser._id.toString());

    // Filter out users who don't have at least one role in common with the current user's interests
    const usersWithCommonRoles = filteredUsers.filter(
      (user) =>
        user.interested_in_roles.filter((role) =>
          currentUser.roles.includes(role)
        ).length > 0 ||
        currentUser.interested_in_roles.filter((role) =>
          user.roles.includes(role)
        ).length > 0
    );

    // Filter out users whose content doesn't overlap with the current user's content
    const usersWithMatchingContent = usersWithCommonRoles.filter(
      (user) =>
        user.content.some((contentItem) =>
          currentUser.content.includes(contentItem)
        ) ||
        currentUser.content.some((contentItem) =>
          user.content.includes(contentItem)
        )
    );

    res.json(usersWithMatchingContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search for users' });
  }
});





module.exports = router;
