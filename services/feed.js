const Feed = require('../models/Feed');

exports.findLazyFeeds = async (user, page) => {
  const itemsPerPage = 10;
  const count = await Feed.countDocuments();
  const userQuery = user === undefined ? {} : { writerId: user };

  const feeds = await Feed.find(userQuery)
    .sort({ updatedAt: -1 })
    .skip(itemsPerPage * (page - 1))
    .limit(itemsPerPage);

  return {
    feeds,
    totalPages: Math.ceil(count / itemsPerPage),
    currentPage: page,
  };
};

exports.findFeedById = async (feedId) => {
  return await Feed.findById(feedId);
};

exports.createFeed = async (newFeed) => {
  return await Feed.create(newFeed);
};

exports.updateFeed = async (feedId, updatedFeed) => {
  return await Feed.findByIdAndUpdate(feedId, updatedFeed);
};

exports.deleteFeedById = async (feedId) => {
  return await Feed.findByIdAndRemove(feedId);
};
