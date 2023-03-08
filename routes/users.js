const express = require('express')
const { hashPassword } = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router()

router.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, username, server, roles, content } = req.body;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({ name, email, password: hashedPassword, username, server, roles, content });

    // Save user to database
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router