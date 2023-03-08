const bcrypt = require('bcrypt');
const User = require('./models/user');

// Function to hash a password
const hashPassword = (password) => {
  return bcrypt.genSalt(10)
    .then((salt) => bcrypt.hash(password, salt));
};

// Function to compare a password to a hashed password
const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Function to authenticate a user by email or username and password
const authenticateUser = (emailOrUsername, password) => {
  return User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] })
    .then((user) => {
      if (!user) throw new Error('User not found');
      return comparePassword(password, user.password)
        .then((passwordMatch) => {
          if (!passwordMatch) throw new Error('Invalid password');
          return user;
        });
    });
};

// Example usage:
const emailOrUsername = 'example@example.com'; // or 'example'
const password = 'mypassword';
authenticateUser(emailOrUsername, password)
  .then((user) => {
    console.log('User authenticated:', user);
  })
  .catch((err) => {
    console.error('Authentication failed:', err.message);
  });
