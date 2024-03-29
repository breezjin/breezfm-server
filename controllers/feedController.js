const {
  createFeed,
  updateFeed,
  findLazyFeeds,
  findFeedById,
  deleteFeedById,
} = require('../services/feed');
const { addFeedToUser, deleteFeedByUserId } = require('../services/user');
const { RESPONSE_RESULT, ERROR_MESSAGES } = require('../utils/constants');
const ErrorWithStatus = require('../utils/ErrorwithStatus');

exports.getFeeds = async (req, res, next) => {
  const { user, page } = req.query;

  try {
    const feeds = await findLazyFeeds(user, page);

    res.json(feeds);
    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_FIND_FEED
      )
    );
  }
};

exports.getFeed = async (req, res, next) => {
  try {
    const { feedId } = req.params;
    const existingFeed = await findFeedById(feedId);

    res.json(existingFeed);
    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_FIND_FEED
      )
    );
  }
};

exports.saveFeed = async (req, res, next) => {
  try {
    const {
      writerAvatar,
      writerName,
      description,
      tag,
      nowPlaying,
      updatedAt,
    } = req.body;

    const submittedFeed = {
      writerId: req.userInfo._id,
      writerAvatar,
      writerName,
      description,
      tag,
      nowPlaying,
      updatedAt,
    };

    const createdFeed = await createFeed(submittedFeed);
    await addFeedToUser(req.userInfo._id, createdFeed._id);

    res.json({
      result: RESPONSE_RESULT.OK,
      feed: createdFeed,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_CREATE_FEED
      )
    );
  }
};

exports.updateFeed = async (req, res, next) => {
  const { feedId } = req.params;

  try {
    const { description, tag, updatedAt, deletedAt } = req.body;
    const submittedFeed = {
      description,
      tag,
      updatedAt,
      deletedAt,
    };

    if (!submittedFeed.description) {
      throw new Error();
    }

    await updateFeed(feedId, submittedFeed);

    res.json({
      result: RESPONSE_RESULT.OK,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_UPDATE_FEED
      )
    );
  }
};

exports.deleteFeed = async (req, res, next) => {
  const { feedId } = req.params;

  try {
    const { writer } = await deleteFeedById(feedId);
    await deleteFeedByUserId(writer, feedId);

    res.json({
      result: RESPONSE_RESULT.OK,
    });

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_UPDATE_FEED
      )
    );
  }
};
