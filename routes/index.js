const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200);
  // res.render('BREEZ api Server!');
});

module.exports = router;
