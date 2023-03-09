const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { hashPassword } = require('../controllers/auth');
const { authenticateUser } = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router()

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




module.exports = router;
