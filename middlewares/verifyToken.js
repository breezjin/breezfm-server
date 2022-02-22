const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { getUserById } = require('../service/user');
const { RESPONSE_RESULT, ERROR_MESSAGES } = require('../utils/constants');
const ErrorWithStatus = require('../utils/ErrorwithStatus');

const verifyPoodadakToken = async (req, res, next) => {
  let prefix;
  let fetchedToken;

  if (req.headers.authorization) {
    [prefix, fetchedToken] = req.headers.authorization.split(' ');
  }

  if (prefix !== 'Bearer' || !fetchedToken) {
    next(
      new ErrorWithStatus(
        null,
        400,
        RESPONSE_RESULT.NO_TOKEN,
        ERROR_MESSAGES.FAILED_TO_VERIFY_TOKEN
      )
    );

    return;
  }

  try {
    const { id } = await jwt.verify(fetchedToken, process.env.JWT_SECRET);
    const user = await getUserById(id);

    if (!user) {
      next(
        new ErrorWithStatus(
          null,
          404,
          RESPONSE_RESULT.NO_USER,
          ERROR_MESSAGES.FAILED_TO_FIND_MATCHING_USER
        )
      );

      return;
    }

    req.userInfo = user;

    next();
  } catch (error) {
    const isMongooseError = error instanceof mongoose.Error;
    let errMessage = ERROR_MESSAGES.FAILED_TO_VERIFY_TOKEN;
    let statusCode = 401;

    if (isMongooseError) {
      errMessage = ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB;
      statusCode = 500;
    }

    next(
      new ErrorWithStatus(error, statusCode, RESPONSE_RESULT.ERROR, errMessage)
    );
  }
};

module.exports = verifyPoodadakToken;
