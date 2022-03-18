const User = require('../models/User');

exports.findUserByUserId = async (userId) => {
  return await User.findById(userId);
};

exports.findFeedsByUserId = async (userId) => {
  return await User.findById(userId)
    .populate({
      path: 'feedList',
      populate: { path: 'feeds', model: 'Feed' },
    })
    .lean();
};
