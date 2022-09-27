const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

const commonRouter = require('./routes/common');
app.use('/', commonRouter);

const userRouter = require('./routes/user');
app.use('/user', userRouter);

const chatRouter = require('./routes/chat');
app.use('/chat', chatRouter);

module.exports = app;