const { getAllUsers } = require('../services/user');
const { RESPONSE_RESULT, ERROR_MESSAGES } = require('../utils/constants');
const ErrorWithStatus = require('../utils/ErrorwithStatus');

exports.findAllUsers = async (req, res, next) => {
  try {
    const response = await getAllUsers();

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
