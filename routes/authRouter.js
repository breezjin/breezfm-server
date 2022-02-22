const express = require('express');
const router = express.Router();

const {
  signinKakao,
  signinNaver,
  sendVerified,
} = require('../controller/authController');
const verifyPoodadakToken = require('../middlewares/verifyPoodadakToken');

router.post('/kakao', signinKakao);
router.post('/naver', signinNaver);
router.post('/token-verification', verifyPoodadakToken, sendVerified);

module.exports = router;
