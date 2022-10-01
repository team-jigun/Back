const router = require('express').Router();

const { checkToken, checkTokenSocket } = require('../middlewares/auth');

const jwt = require('jsonwebtoken');
const { TOKEN_OR_REFRESH_EMPTY, TOKEN_EXPIRED, TOKEN_INVALID, OTHER, SOCKET_ERROR: { EMPTY_ROOM_NAME, NOT_EXISTS_ROOM } } = require('../modules/ERROR');
 
const socketPort = process.env.SOCKET_PORT || 3001;
const { Server } = require('socket.io');
const io = new Server(socketPort);

const chatHandler = require('./handler/chatHandler');

io.use(async (socket, next) => {
  try {
    await checkTokenSocket(socket.request);

    next();
  } catch (error) {
    const { code } = error;
    let errorObject = OTHER;

    if (code === TOKEN_OR_REFRESH_EMPTY.code) errorObject = TOKEN_OR_REFRESH_EMPTY;
    else if (code === TOKEN_EXPIRED.code) errorObject = TOKEN_EXPIRED;
    else if (code === TOKEN_INVALID.code) errorObject = TOKEN_INVALID;

    
    next(error);
  }
});

io.use((socket, next) => {
  try {
    const token = socket.request.headers.authorization.replace('Bearer ', '');

    socket.userId = jwt.decode(token).id;
    next();
  } catch (error) {
    next(error);
  }
})

io.on('connection', async socket => {
  let roomList = await chatHandler.getChatRoomList();
  console.log(`connection: ${roomList}`);

  socket.on('connectionRoom', roomName => {
    const selectedRoom = roomList.filter(room => room === roomName)[0];

    if (selectedRoom) socket.join(selectedRoom);
  });

  socket.on('newRoom', async _ => {
    roomList = await chatHandler.getChatRoomList();
  });

  socket.on('message', (roomName, userName, message) => {
    console.log(`roomName: ${roomName}, userName: ${userName}, message: ${message}`);
    if (!roomList.includes(roomName)) throw NOT_EXISTS_ROOM;
  });
});

router.post('/createRoom', checkToken, chatHandler.createNewRoom, async _ => {
  io.emit('newRoom', await chatHandler.getChatRoomList());
});

router.post('/changeUsername', checkToken, chatHandler.changeUsernameByRoom, req => {

});

router.post('/changeCurrentUsername', checkToken, chatHandler.changeCurrentNameByRoom, req => {
  const { id: userId, body: { roomName } } = req;

  io.to(roomName).emit('changeUsername', userId);
});

router.post('/removeRoom', checkToken, chatHandler.removeRoom, req => {
  io.emit('removeRoom', req.roomName);
});

router.post('/addUserToRoom', checkToken, chatHandler.addUserToRoom);

module.exports = router;