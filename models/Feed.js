const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  writer: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User',
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
  updatedAt: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Feed', feedSchema);
