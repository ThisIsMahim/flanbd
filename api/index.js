const serverless = require('serverless-http');
const app = require('../backend/app');
const connectDatabase = require('../backend/config/database');

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDatabase();
      isConnected = true;
    }
    const handler = serverless(app);
    return handler(req, res);
  } catch (err) {
    console.error('Serverless handler error:', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
};
