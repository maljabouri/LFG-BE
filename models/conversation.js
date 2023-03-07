const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  user1: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
  user2: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
  messages: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Message' }]
});
// Require Mongoose Model
const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = Conversation