const bcrypt = require('bcrypt');
const User = require('../models/user');

// Function to hash a password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Function to compare a password to a hashed password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Function to authenticate a user by username and password
const authenticateUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) throw new Error('Invalid password');
  return user;
};


module.exports = {
  hashPassword,
  comparePassword,
  authenticateUser
};
