const User = require('../models/User');

exports.getAllUsers = async function () {
  return await User.find();
};

exports.getUser = async function (userInfo) {
  return await User.findOne(userInfo);
};

exports.createUser = async function (newUser) {
  return await User.create(newUser);
};

exports.getUserById = async function (id) {
  return await User.findById(id);
};

exports.addFeedToUser = async function (userId, feedId) {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { feedList: feedId } },
    { new: true }
  );
};

exports.deleteFeedByUserId = async function (userId, feedId) {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { reviewList: feedId } },
    { new: true }
  );
};
