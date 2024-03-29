require('dotenv').config();
if (process.env.NODE_ENV !== 'test') {
  require('./config/mongoose');
}

const path = require('path');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');

const authRouter = require('./routes/authRouter');
const feedsRouter = require('./routes/feedsRouter');
const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profileRouter');
const usersRouter = require('./routes/usersRouter');

const corsOptions = {
  origin: process.env.CORS_ORIGIN_URL,
  credentials: true,
};

const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/feeds', feedsRouter);
app.use('/users', usersRouter);

app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({
    result: error.result,
    errMessage: error.message,
  });
});

module.exports = app;
