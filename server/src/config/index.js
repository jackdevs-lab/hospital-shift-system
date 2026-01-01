const cors = require('./cors');
const rateLimit = require('./rateLimit');
const constants = require('./constants');

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,

  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',

  cors: cors || {
    origin: '*'
  },

  rateLimit: rateLimit || {
    windowMs: 15 * 60 * 1000,
    max: 100
  },
  morgan: {
    format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
  },

  constants
};
