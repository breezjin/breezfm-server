const User = require('../models/User');

exports.getUser = async function (userInfo) {
  return await User.findOne(userInfo);
};

exports.createUser = async function (newUser) {
  return await User.create(newUser);
};

exports.getUserById = async function (id) {
  return await User.findById(id);
};

exports.addReviewToUser = async function (userId, reviewId) {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { reviewList: reviewId } },
    { new: true }
  );
};

exports.deleteReviewByUserId = async function (userId, reviewId) {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { reviewList: reviewId } },
    { new: true }
  );
};
