const url = require('url');

const axios = require('axios');
const mongoose = require('mongoose');

const { createUser, getUser } = require('../services/user');
const {
  ERROR_MESSAGES,
  RESPONSE_RESULT,
  SOCIAL_SERVICE,
} = require('../utils/constants');
const ErrorWithStatus = require('../utils/ErrorwithStatus');
const signToken = require('../utils/signToken');

function createAndSendToken(user, res) {
  const BREEZ_TOKEN = signToken(user._id);

  res.json({
    result: RESPONSE_RESULT.OK,
    userId: user._id,
    userAvatar: user.avatar,
    userName: user.username,
    userEmail: user.email,
    BREEZ_TOKEN: BREEZ_TOKEN,
  });

  return;
}

exports.signinKakao = async (req, res, next) => {
  const socialService = SOCIAL_SERVICE.KAKAO;

  try {
    const params = new url.URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY,
      redirect_uri: process.env.KAKAO_REST_API_REDIRECT_URL,
      code: req.body.token,
      client_secret: process.env.KAKAO_REST_API_CLIENT_SECRET,
    });

    const clientTokenVerificationResponse = await axios.post(
      process.env.KAKAO_REST_API_VERIFY_TOKEN_URL,
      params.toString(),
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );

    const didUserApproveEmail =
      clientTokenVerificationResponse.data.scope.includes('account_email');

    if (!didUserApproveEmail) {
      await axios.post(
        process.env.KAKAO_REST_API_UNLINK_USER_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${clientTokenVerificationResponse.data.access_token}`,
          },
        }
      );

      next(
        new ErrorWithStatus(
          null,
          401,
          RESPONSE_RESULT.ERROR,
          ERROR_MESSAGES.USER_DID_NOT_APPROVE_NECESSARY_INFO
        )
      );

      return;
    }

    const fetchUserUrlParams = new url.URLSearchParams({
      property_keys:
        '["kakao_account.email", "kakao_account.profile.nickname", "kakao_account.profile.profile_image_url"]',
    });

    const fetchedUserInfo = await axios.post(
      process.env.KAKAO_REST_API_FETCH_USER_INFO_URL,
      fetchUserUrlParams.toString(),
      {
        headers: {
          Authorization: `Bearer ${clientTokenVerificationResponse.data.access_token}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );

    let currentUser = await getUser({
      email: fetchedUserInfo.data.kakao_account.email,
      socialService,
    });

    if (!currentUser) {
      const newUser = {
        username: fetchedUserInfo.data.kakao_account.profile.nickname,
        avatar: fetchedUserInfo.data.kakao_account.profile.profile_image_url,
        email: fetchedUserInfo.data.kakao_account.email,
        socialService,
      };

      currentUser = await createUser(newUser);
    }

    createAndSendToken(currentUser, res);
  } catch (error) {
    const errMessage =
      error instanceof mongoose.Error
        ? ERROR_MESSAGES.FAILED_TO_COMMUNICATE_WITH_DB
        : ERROR_MESSAGES.FAILED_TO_AUTHENTICATE_KAKAO;

    next(new ErrorWithStatus(error, 500, RESPONSE_RESULT.ERROR, errMessage));
  }
};

exports.sendVerified = (req, res, next) => {
  res.json({
    result: RESPONSE_RESULT.VERIFIED,
    userId: req.userInfo._id,
    userAvatar: req.userInfo.avatar,
    userName: req.userInfo.username,
    userEmail: req.userInfo.email,
  });
};
