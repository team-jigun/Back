const router = require('express').Router();

const { checkToken, checkTokenSocket } = require('../middlewares/auth');

const jwt = require('jsonwebtoken');
const { TOKEN_OR_REFRESH_EMPTY, TOKEN_EXPIRED, TOKEN_INVALID, OTHER, SOCKET_ERROR: { EMPTY_ROOM_NAME, NOT_EXISTS_ROOM } } = require('../modules/ERROR');
 
const socketPort = process.env.SOCKET_PORT || 3001;
const { Server } = require('socket.io');
const io = new Server(socketPort);

const chatHandler = require('./handler/chatHandler');
const { insertMessage } = require('./handler/chatHandler');

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
    const selectedRoom = roomList.filter(room => room.roomName === roomName)[0];

    if (selectedRoom) socket.join(selectedRoom.roomName);
  });

  socket.on('newRoom', async _ => {
    roomList = await chatHandler.getChatRoomList();
  });

  socket.on('message', async (roomName, userId, message) => {
    console.log(`userId: ${userId}, message: ${message}`);
    if (roomList.filter(room => room.roomName === roomName).length === 0) throw NOT_EXISTS_ROOM;

    await insertMessage(roomName, userId, message);
    socket.to(roomName).emit('sendingMessage', userId, message);
  });
});

router.post('/admin/createRoom', checkToken, chatHandler.createNewRoom, async _ => {
  io.emit('newRoom');
});

router.post('/admin/changeUsername', checkToken, chatHandler.changeUsernameByRoom, req => {
  const { id: userId, body: { roomName } } = req;

  io.to(roomName).emit('changeUsername', userId);
});

router.post('/me/changeUsername', checkToken, chatHandler.changeCurrentNameByRoom, req => {
  const { id: userId, body: { roomName } } = req;

  io.to(roomName).emit('changeUsername', userId);
});

router.post('/admin/removeRoom', checkToken, chatHandler.removeRoom, req => {
  io.emit('removeRoom', req.roomName);
});

router.post('/admin/addUserToRoom', checkToken, chatHandler.addUserToRoom, req => {
  const { roomName, userId } = req.body;

  io.to(roomName).emit('addUser', userId);
});

router.post('/admin/kickUser', checkToken, chatHandler.kickUserByRoom, req => {
  const { roomName, userId } = req.body;

  io.to(roomName).emit('kickUser', userId);
});

router.post('/admin/updatePermission', checkToken, chatHandler.updatePermission, req => {
  const { id: userId, body: { roomName } } = req;

  io.to(roomName).emit('updatePermission', userId);
});

module.exports = router;