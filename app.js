const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

const userRouter = require('./routes/user');

app.use('/user', userRouter);

module.exports = app;