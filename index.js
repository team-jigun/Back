const app = require('./app');
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_DB_URL || 'mongodb://localhost/digitech';
mongoose.connect(mongoURL);


app.listen(port, _ => {
  console.log(`Server ON!\nServer Port is ${port}`);
});

const socketPort = process.env.SOCKET_PORT || 3001;
const { Server } = require('socket.io');
const io = new Server(socketPort);

io.on('connection', socket => {
  const { authorization: token, refresh: refreshToken } = socket.request.headers;
  if (!token || !refreshToken) {
    socket.disconnect();
  }

  socket.on('message', message => {
    console.log(message); 
  });
});