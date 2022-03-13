const User = require('../models/User');

exports.findUserByUserId = async (userId) => {
  return await User.findById(userId);
};

exports.findReviewByUserId = async (userId) => {
  return await User.findById(userId)
    .populate({
      path: 'reviewList',
      populate: { path: 'toilet', model: 'Toilet' },
    })
    .lean();
};
