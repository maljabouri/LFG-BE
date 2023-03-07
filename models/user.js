const mongoose = require('mongoose');
const axios = require('axios');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  nickname: { type: String },
  server: { type: [String], required: true },
  roles: { type: [String], required: true },
  content: [{ 
    type: [String], required: true,
    enum: ['raid', 'dungeon'], required: true    
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }]
});

module.exports = UserModel