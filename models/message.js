const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation' 
  },
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  text: String,
  timestamp: Date
});

// Require Mongoose Model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
