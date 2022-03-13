exports.ERROR_MESSAGES = {
  URL_NOT_FOUND: "ERROR: URL not found.",
  FAILED_TO_AUTHENTICATE_KAKAO:
    "ERROR: Failed to authenticate from Kakao server with your data.",
  FAILED_TO_AUTHENTICATE_NAVER:
    "ERROR: Failed to authenticate from Naver server with your data.",
  FAILED_TO_COMMUNICATE_WITH_DB:
    "ERROR: Something went wrong while communicating to our DB.",
  FAILED_TO_CHECK_LIVE_CHATROOM:
    "ERROR: failed to check Live chatroom from DB.",
  FAILED_TO_FETCH_CORRESPONDING_USER:
    "ERROR: Cannot find the userdata with the email or _id.",
  FAILED_TO_ESTABLISH_SOCKET_CONNECTION:
    "ERROR: Cannot establish socket connection either by authentication error or db error.",
  FAILED_TO_GET_USER_PROFILE: "ERROR: failed to get userProfile.",
  FAILED_TO_FIND_FEED: "ERROR: faileded to find feed...",
  FAILED_TO_FIND_EXISTING_CHATROOM:
    "ERROR: failed to find existing chatroom...",
  FAILED_TO_CREATE_FEED: "ERROR: faileded to create feed...",
  FAILED_TO_UPDATE_FEED: "ERROR: faileded to update feed.",
  FAILED_TO_GET_S3_URL: "ERROR: failed to get s3URL...",
  FAILED_TO_GET_TOILET: "ERROR: failed to get toilet...",
  FAILED_TO_GET_FEED_LIST: "ERROR: failed to get feedList...",
  FAILED_TO_CREATE_CHATROOM: "ERROR: failed to create chatroom...",
  FAILED_TO_CHECK_CHATROOM_LIVE_STATUS:
    "ERROR: failed to check chatroom's live-status...",
  USER_DID_NOT_APPROVE_NECESSARY_INFO:
    "ERROR: Please, login again, select email & nickname too.",
  FAILED_TO_VERIFY_TOKEN: "ERROR: Cannot verify your token.",
  FAILED_TO_FIND_MATCHING_USER: "ERROR: Cannot find user.",
};

exports.RESPONSE_RESULT = {
  ERROR: "error",
  OK: "ok",
  TOKEN_DELETED: "Poodadak Token deleted",
  VERIFIED: "verified",
  NO_TOKEN: "no token",
  NO_USER: "no user",
};

exports.SOCIAL_SERVICE = {
  KAKAO: "KAKAO",
  NAVER: "NAVER",
};

exports.USER_LEVEL = {
  GOLD: "GOLD",
  SILVER: "SILVER",
  BRONZE: "BRONZE",
};
