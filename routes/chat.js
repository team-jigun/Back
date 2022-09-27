const router = require('express').Router();

const authUtil = require('../middlewares/auth').checkTokenSocket;

const util = require('../modules/util');
const { TOKEN_OR_REFRESH_EMPTY, TOKEN_EXPIRED, TOKEN_INVALID, OTHER } = require('../modules/ERROR');
 
const socketPort = process.env.SOCKET_PORT || 3001;
const { Server } = require('socket.io');
const io = new Server(socketPort);

io.on('connection', async socket => {
  try {
    await authUtil(socket.request);
  } catch (error) {
    const { code } = error;
    let errorObject = OTHER;

    if (code === TOKEN_OR_REFRESH_EMPTY.code) errorObject = TOKEN_OR_REFRESH_EMPTY;
    else if (code === TOKEN_EXPIRED.code) errorObject = TOKEN_EXPIRED;
    else if (code === TOKEN_INVALID.code) errorObject = TOKEN_INVALID;
    else console.log(error);

    console.log(`Socket Id: ${socket.id}\nCODE: ${errorObject.code}\nMESSAGE: ${errorObject.message}`);
    socket.disconnect();
  }

  socket.on('message', message => {
    console.log(message); 
  });
});

module.exports = router;