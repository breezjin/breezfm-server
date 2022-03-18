const { findUserByUserId, findFeedsByUserId } = require('../services/profile');
const { RESPONSE_RESULT, ERROR_MESSAGES } = require('../utils/constants');
const ErrorWithStatus = require('../utils/ErrorwithStatus');

exports.getUserProfile = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const response = await findUserByUserId(userId);

    res.json(response);

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_GET_USER_PROFILE
      )
    );
  }
};

exports.getUserFeeds = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const response = await findFeedsByUserId(userId);

    res.json(response);

    return;
  } catch (error) {
    next(
      new ErrorWithStatus(
        error,
        500,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_GET_USER_PROFILE
      )
    );
  }
};
