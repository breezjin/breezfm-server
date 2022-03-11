const express = require('express');
const router = express.Router();

const { signinKakao, sendVerified } = require('../controllers/authController');
const verifyBreezToken = require('../middlewares/verifyToken');

router.post('/kakao', signinKakao);
router.post('/naver');
router.post('/token-verification', verifyBreezToken, sendVerified);

module.exports = router;
