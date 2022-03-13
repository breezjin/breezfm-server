const express = require('express');
const router = express.Router();

const {
  saveFeed,
  updateFeed,
  getFeeds,
  getFeed,
  deleteFeed,
} = require('../controllers/feedController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', getFeeds);
router.get('/:feedId', getFeed);

router.post('/', verifyToken, saveFeed);
router.post('/:feedId', verifyToken, updateFeed);

router.delete('/:feedId', verifyToken, deleteFeed);

module.exports = router;
