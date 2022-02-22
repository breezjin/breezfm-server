/* eslint-disable no-prototype-builtins */
const mongoose = require('mongoose');

const { USER_LEVEL, SOCIAL_SERVICE } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: [USER_LEVEL.GOLD, USER_LEVEL.SILVER, USER_LEVEL.BRONZE],
    default: USER_LEVEL.BRONZE,
    required: true,
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
  reviewList: {
    type: [mongoose.ObjectId],
    ref: 'Review',
  },
  currentChatRoom: {
    type: mongoose.ObjectId,
    ref: 'Chatroom',
  },
});

userSchema.post('findOneAndUpdate', async function (doc, next) {
  if (doc.reviewList.length < 5) {
    doc.level = USER_LEVEL.BRONZE;
    await doc.save();
    next();
    return;
  }

  if (doc.reviewList.length < 10) {
    doc.level = USER_LEVEL.SILVER;
    await doc.save();
    next();
    return;
  }

  if (doc.reviewList.length >= 10) {
    doc.level = USER_LEVEL.GOLD;
    await doc.save();
    next();
    return;
  }
});

module.exports = mongoose.model('User', userSchema);
