require('dotenv').config();
const fs = require('fs');

module.exports = {
  mongodbURI: process.env.MONGODB_URI,
  redisURL: process.env.REDIS_URL,
  jwtSecret: process.env.JWT_SECRET,
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback', // Update with your callback URL
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback', // Update with your callback URL
    privateKey: process.env.GITHUB_PRIVATE_KEY,
    appId: process.env.GITHUB_APP_ID,
    privateKey: fs.readFileSync('private-key.pem', 'utf-8')
  },
};