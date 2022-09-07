const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  writerId: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User',
  },
  writerAvatar: {
    type: String,
    required: true,
  },
  writerName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxLength: 500,
  },
  tag: {
    type: Array,
  },
  nowPlaying: {
    type: String,
  },
  updatedAt: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: String,
  },
});

module.exports = mongoose.model('Feed', feedSchema);
