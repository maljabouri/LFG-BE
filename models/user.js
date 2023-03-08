const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  server: { 
    type: [String], required: true, 
    enum: ['EU', 'US']
  },
  roles: { 
    type: [String], required: true,
    enum: ['tank', 'dps', 'healer']
  },
  content: [{ 
    type: [String], required: true,
    enum: ['raid', 'dungeon']  
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }]
});

// Require Mongoose Model
const User = mongoose.model('User', userSchema)

module.exports = User