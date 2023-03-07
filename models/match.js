const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }]
});

// Require Mongoose Model
const MatchModel = mongoose.model('Match', matchSchema);

module.exports = MatchModel;