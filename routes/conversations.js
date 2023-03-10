const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');

// Get a conversation by user IDs
// Get a conversation by user IDs
router.get('/api/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate('user1 user2 messages');
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a conversation by user IDs
router.get('/api/conversations', async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ message: 'Both user1 and user2 parameters are required' });
    }
    const conversation = await Conversation.findOne({ $or: [{ user1, user2 }, { user1: user2, user2: user1 }] }).populate('user1 user2 messages');
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});



// Create a new conversation between two users
router.post('/api/conversations', async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({ $or: [{ user1, user2 }, { user1: user2, user2: user1 }] });
    if (existingConversation) {
      return res.status(400).json({ message: 'Conversation already exists' });
    }

    const conversation = new Conversation({
      user1,
      user2
    });

    await conversation.save();

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
