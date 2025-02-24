require('dotenv').config({ path: __dirname + '/../backend/.env' });

const credentials = {
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
};

module.exports = credentials;