const bcrypt = require('bcrypt');
const User = require('../models/user');

// Register User route

router.post('/register', (req, res) => {
  const { name, email, password, username, server, roles, content } = req.body;

  // Hash password
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      // Create new user
      const user = new User({ name, email, password: hashedPassword, username, server, roles, content });

      // Save user to database
      return user.save();
    })
    .then((savedUser) => {
      res.status(201).json(savedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Server error');
    });
});
