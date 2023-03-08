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

// Function to authenticate a user by email or username and password
const authenticateUser = async (emailOrUsername, password) => {
  const user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
  if (!user) throw new Error('User not found');
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) throw new Error('Invalid password');
  return user;
};

// // Example usage:
// const run = async () => {
//   try {
//     const emailOrUsername = 'example@example.com'; // or 'example'
//     const password = 'mypassword';
//     const user = await authenticateUser(emailOrUsername, password);
//     console.log('User authenticated:', user);
//   } catch (err) {
//     console.error('Authentication failed:', err.message);
//   }
// };
// run();

module.exports = {
  hashPassword,
  comparePassword,
  authenticateUser
};
