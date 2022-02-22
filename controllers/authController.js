const url = require('url');

const axios = require('axios');
const mongoose = require('mongoose');

const { createUser, getUser } = require('../service/user');
const {
  ERROR_MESSAGES,
  RESPONSE_RESULT,
  SOCIAL_SERVICE,
} = require('../utils/constants');
const ErrorWithStatus = require('../utils/ErrorwithStatus');
const signToken = require('../utils/signToken');

function createAndSendToken(user, res) {
  const POODADAK_TOKEN = signToken(user._id);

  res.json({
    result: RESPONSE_RESULT.OK,
    userId: user._id,
    POODADAK_TOKEN: POODADAK_TOKEN,
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
        '["kakao_account.email", "kakao_account.profile.nickname"]',
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

exports.signinNaver = async (req, res, next) => {
  const socialService = SOCIAL_SERVICE.NAVER;
  const { code, state } = req.body;

  if (!code || !state) {
    next(
      new ErrorWithStatus(
        null,
        401,
        RESPONSE_RESULT.ERROR,
        ERROR_MESSAGES.FAILED_TO_AUTHENTICATE_NAVER
      )
    );

    return;
  }

  try {
    const params = new url.URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NAVER_API_CLIENT_ID,
      client_secret: process.env.NAVER_API_CLIENT_SECRET,
      code,
      state,
    });

    const token = await axios.post(
      process.env.NAVER_API_GET_TOKEN_URL,
      params.toString()
    );

    const { access_token, token_type } = token.data;
    const { data } = await axios.get(process.env.NAVER_API_GET_USER_INFO_URL, {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });

    const { email, nickname } = data.response;

    if (!email || !nickname) {
      const params = new url.URLSearchParams({
        client_id: process.env.NAVER_API_CLIENT_ID,
        client_secret: process.env.NAVER_API_CLIENT_SECRET,
        access_token,
        grant_type: 'delete',
        service_provider: 'Naver',
      });

      await axios.post(
        process.env.NAVER_REST_API_UNLINK_USER_URL,
        params.toString(),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
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

    let currentUser = await getUser({ email, socialService });

    if (!currentUser) {
      const newUser = {
        username: nickname,
        email,
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
  });
};
