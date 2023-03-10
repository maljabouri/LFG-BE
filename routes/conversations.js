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



// Create a new conversation with the matched user
router.post('/api/conversations', async (req, res) => {
  const { members } = req.body;

  try {
    // Check if a conversation with these members already exists
    const existingConversation = await Conversation.findOne({
      members: { $all: members },
    });

    if (existingConversation) {
      return res.status(400).json({ error: 'Conversation already exists' });
    }

    // Create a new conversation with the given members
    const newConversation = new Conversation({
      members,
    });
    await newConversation.save();

    res.status(201).json(newConversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;



