const mongoose = require('mongoose');

mongoose.set('debug', true);

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, '❌ DB CONNECTION_ERROR'));
// eslint-disable-next-line no-console
db.once('open', console.log.bind(console, '✅ DB CONNECTED_DATABASE'));
