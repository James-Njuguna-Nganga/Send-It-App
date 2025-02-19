const express = require('express');
const bodyParser = require('body-parser');
const sendSMS = require('./sendSms');

const app = express();
const PORT = 6000;

app.use(bodyParser.json());
app.use('/', sendSMS);

app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`);
});