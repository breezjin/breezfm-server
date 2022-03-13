const mongoose = require('mongoose');

const { SOCIAL_SERVICE } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  socialService: {
    type: String,
    enum: [SOCIAL_SERVICE.KAKAO, SOCIAL_SERVICE.NAVER],
    required: true,
  },
  feedList: {
    type: [mongoose.ObjectId],
    ref: 'Feed',
  },
});

module.exports = mongoose.model('User', userSchema);
