const express = require('express');
const router = express.Router();

const { findAllUsers } = require('../controllers/userController');

/* GET users listing. */
router.get('/', findAllUsers);

module.exports = router;
