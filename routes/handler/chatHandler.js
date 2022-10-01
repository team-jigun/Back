const ChatRooms = require('../../Schema/ChatRooms');
const User = require('../../Schema/User');

const { OTHER, SOCKET_ERROR: { NOT_EXISTS_ROOM, EMPTY_ROOM_NAME }, NOT_EXISTS_ID, EMPTY_INFO: { USERNAME, USER_ID }, PERMISSION_INSUFFICIENT } = require('../../modules/ERROR');
const util = require('../../modules/util');

const USER_PERMISSION = {
  READ: 1,
  WRITE: 2,
  ADD: 3,
  KICK: 4,
  ADMIN: 5
};

module.exports = {
  getChatRoomList: async _ => {
    try {
      return await ChatRooms.find();
    } catch(error) {
      console.log(`getChatRoomList\nError Name: ${error.name}\nError Message: ${error.message}`);

      return [];
    }
  },
  createNewRoom: async (req, res, next) => {
    const { roomName } = req.body;  

    try {
      if (!roomName) {
        throw EMPTY_ROOM_NAME;
      }

      const user = await User.findOne({ id: req.id });

      if (!user) throw NOT_EXISTS_ID;

      const newRoom = new ChatRooms({roomName, users: [{ id: user.id, name: user.name, permission: USER_PERMISSION.ADMIN }]});
      await newRoom.save();

      next();
      return res.json(util.success('Success Create Room', 'Success Create Room!'));
    } catch (error) {
      const { code } = error;
      
      switch(code) {
        case EMPTY_ROOM_NAME.code:
          return res.json(util.fail(EMPTY_ROOM_NAME.code, EMPTY_ROOM_NAME.message));
        case NOT_EXISTS_ID.code:
          return res.json(util.fail(NOT_EXISTS_ID.code, NOT_EXISTS_ID.message));
        default:
          console.log(error);
          return res.json(util.fail(OTHER.code, OTHER.message));
      }
    }
  },
  insertMessage: async (roomName, userId, userName, message) => {

  },
  changeUsernameByRoom: async (req, res) => {
    const { roomName, userId, username } = req.body;

    try {
      if (!roomName) {
        throw EMPTY_ROOM_NAME;
      } else if (!userId) {
        throw USER_ID;
      } else if (!username) {
        throw USERNAME;
      }

      const user = await User.findOne({ id: userId });
      if (!user) throw NOT_EXISTS_ID;

      const room = await ChatRooms.findOne({ roomName });
      if (!room) throw NOT_EXISTS_ROOM;

      if (room['users'][user.id].permission < USER_PERMISSION.KICK) throw PERMISSION_INSUFFICIENT;

      if (username !== username) {
        await ChatRooms.updateOne({ roomName, "users.id": userId }, { $set: { "users.$.name": username } });
      }

      return res.json(util.success(`Success Change username`, `Success Change username by ${room.roomName}`));
    } catch (error) {
      const { code } = error;
      
      switch(code) {
        case EMPTY_ROOM_NAME.code:
          return res.json(util.fail(EMPTY_ROOM_NAME.code, EMPTY_ROOM_NAME.message));
        case USER_ID.code:
          return res.json(util.fail(USER_ID.code, USER_ID.message));
        case USERNAME.code:
          return res.json(util.fail(USERNAME.code, USERNAME.message));
        case NOT_EXISTS_ID.code:
          return res.json(util.fail(NOT_EXISTS_ID.code, NOT_EXISTS_ID.message));
        case NOT_EXISTS_ROOM.code:
          return res.json(util.fail(NOT_EXISTS_ROOM.code, NOT_EXISTS_ROOM.message));
        case PERMISSION_INSUFFICIENT.code:
          return res.json(util.fail(PERMISSION_INSUFFICIENT.code, PERMISSION_INSUFFICIENT.message));
        default:
          console.log(error);
          return res.json(util.fail(OTHER.code, OTHER.message));
      }
    }
  },
  removeRoom: async (req, res, next) => {
    const { roomName } = req.body;

    try {
      const { id: userId } = req;

      const room = await ChatRooms.findOne({ roomName });
      if (!room) throw NOT_EXISTS_ROOM;

      const userList = room.users;
      userList.map(userByRoom => {
        if (userByRoom.id === userId) {
          if (userByRoom.permission < USER_PERMISSION.ADMIN) throw PERMISSION_INSUFFICIENT;
        }
      });

      await ChatRooms.deleteOne({ roomName });
      req.roomName = roomName;

      next();
      return res.json(util.success(`Success Remove Chatting Room`, `Success Remove Chatting Room: ${roomName}`));
    } catch (error) {
      const { code } = error;

      switch(code) {
        case NOT_EXISTS_ROOM.code:
          return res.json(util.fail(NOT_EXISTS_ROOM.code, NOT_EXISTS_ROOM.message));
        case PERMISSION_INSUFFICIENT.code:
          return res.json(util.fail(PERMISSION_INSUFFICIENT.code, PERMISSION_INSUFFICIENT.message));
        default:
          console.log(error);
          return res.json(util.fail(OTHER.code, OTHER.message));
      }
    }
  }
}