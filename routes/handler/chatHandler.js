const ChatRooms = require('../../Schema/ChatRooms');
const User = require('../../Schema/User');

const { OTHER, SOCKET_ERROR: { EXISTS_ROOM, NOT_EXISTS_ROOM, NOT_EXISTS_USER_BY_ROOM, EMPTY_ROOM_NAME }, NOT_EXISTS_ID, EMPTY_INFO: { USERNAME, USER_ID }, PERMISSION_INSUFFICIENT } = require('../../modules/ERROR');
const util = require('../../modules/util');

const USER_PERMISSION = {
  READ: 1,
  WRITE: 2,
  ADD: 3,
  KICK: 4,
  ADMIN: 5,

  1: "READ",
  2: "WRITE",
  3: "ADD",
  4: "KICK",
  5: "ADMIN"
};

class RoomUser {
  constructor(id, name, permission) {
    if (typeof id !== 'string') throw Error('Must be id is string type.');
    else if (!id) throw Error('Id is null.');
    this.id = id;

    if (typeof name !== 'string') throw Error('Must be name is string type.');
    else if (!name) throw Error('Name is null.');
    this.name = name;

    if (!USER_PERMISSION[permission]) throw Error('Undeclared permission.');
    this.permission = permission;
  }
}

const validationUserByRoom = (userList, validationTarget, roomName, permission) => {
  if (userList.filter(userByRoom => userByRoom.id === validationTarget).length === 0) {
    const code = NOT_EXISTS_USER_BY_ROOM.code
        , message = NOT_EXISTS_USER_BY_ROOM.message.replace('[#ROOM_NAME#]', roomName);

    throw { code, message };
  }

  userList.map(userByRoom => {
    if (userByRoom.id === validationTarget) {
      if (userByRoom.permission < permission) throw PERMISSION_INSUFFICIENT;
    }
  });
}

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

      const isExistsRoom = await ChatRooms.findOne({ roomName });
      if (isExistsRoom) throw EXISTS_ROOM

      await ChatRooms.create({roomName, users: [{ id: user.id, name: user.name, permission: USER_PERMISSION.ADMIN }]});

      next();
      return res.json(util.success('Success Create Room', 'Success Create Room!'));
    } catch (error) {
      const { code } = error;
      
      switch(code) {
        case EMPTY_ROOM_NAME.code:
          return res.json(util.fail(EMPTY_ROOM_NAME.code, EMPTY_ROOM_NAME.message));
        case EXISTS_ROOM.code:
          return res.json(util.fail(EXISTS_ROOM.code, EXISTS_ROOM.message));
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

      validationUserByRoom(room.users, userId, roomName, USER_PERMISSION.KICK);

      if (selectedUserByRoom.name !== username) {
        await ChatRooms.updateOne({ roomName, "users.id": userId }, { $set: { "users.$.name": username } });
      }

      return res.json(util.success('Success Change username', `Success Change username by ${room.roomName}`));
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
        case NOT_EXISTS_USER_BY_ROOM.code:
          return res.json(util.fail(NOT_EXISTS_USER_BY_ROOM.code, error.message));
        case PERMISSION_INSUFFICIENT.code:
          return res.json(util.fail(PERMISSION_INSUFFICIENT.code, PERMISSION_INSUFFICIENT.message));
        default:
          console.log(error);
          return res.json(util.fail(OTHER.code, OTHER.message));
      }
    }
  },
  changeCurrentNameByRoom: async (req, res, next) => {
    const { roomName, username } = req.body;
    
    try {
      const { id: userId } = req;

      const room = await ChatRooms.findOne({ roomName });
      if (!room) throw NOT_EXISTS_ROOM;

      validationUserByRoom(room.users, userId, roomName, USER_PERMISSION.WRITE);

      if (currentUser.name !== username) {
        await ChatRooms.updateOne({ roomName, "users.id": userId }, { $set: { "users.$.name": username } });
      }

      next();
      return res.json(util.success('Success Change Current Username', `Success change current username by ${room.roomName}`))
    } catch (error) {
      const { code } = error;

      switch(code) {
        case NOT_EXISTS_ROOM.code:
          return res.json(util.fail(NOT_EXISTS_ROOM.code, NOT_EXISTS_ROOM.message));
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

      validationUserByRoom(room.users, userId, roomName, USER_PERMISSION.ADMIN);

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
  },
  addUserToRoom: async (req, res, next) => {
    const { roomName, userId, permission } = req.body;
    
    try {
      if (!roomName) {
        throw EMPTY_ROOM_NAME;
      } else if (!userId) {
        throw USER_ID;
      }

      const { id: currentUserId } = req;

      const user = await User.findOne({ id: userId });
      if (!user) throw NOT_EXISTS_ID;

      const room = await ChatRooms.findOne({ roomName });
      if (!room) throw NOT_EXISTS_ROOM;

      validationUserByRoom(room.users, currentUserId, roomName, USER_PERMISSION.ADD);

      const addUser = new RoomUser(user.id, user.name, permission ?? USER_PERMISSION.WRITE);

      await ChatRooms.updateOne({ roomName }, { $push: { users: addUser } });

      next();
      return res.json(util.success(`Success Insert User By Room`, `Success Insert ${addUser.id} By Room: ${roomName}`));
    } catch (error) {
      const { code } = error;

      switch(code) {
        case EMPTY_ROOM_NAME.code:
          return res.json(util.fail(EMPTY_ROOM_NAME.code, EMPTY_ROOM_NAME.message));
        case USER_ID.code:
          return res.json(util.fail(USER_ID.code, USER_ID.message));
        case NOT_EXISTS_ID.code:
          return res.json(util.fail(NOT_EXISTS_ID.code, NOT_EXISTS_ID.message));
        case NOT_EXISTS_ROOM.code:
          return res.json(util.fail(NOT_EXISTS_ROOM.code, NOT_EXISTS_ROOM.message));
        case NOT_EXISTS_USER_BY_ROOM.code:
          return res.json(util.fail(NOT_EXISTS_USER_BY_ROOM.code, error.message));
        case PERMISSION_INSUFFICIENT.code:
          return res.json(util.fail(PERMISSION_INSUFFICIENT.code, PERMISSION_INSUFFICIENT.message));
        default:
          console.log(error);
          return res.json(util.fail(OTHER.code, OTHER.message));
      }
    }
  },
  kickUserByRoom: async (req, res, next) => {
    const { roomName, userId } = req.body;

    try {
      if (!roomName) {
        throw EMPTY_ROOM_NAME;
      } else if (!userId) {
        throw USER_ID;
      }

      const { id: currentUserId } = req;

      const user = await User.findOne({ id: userId });
      if (!user) throw NOT_EXISTS_ID;

      const room = await ChatRooms.findOne({ roomName });
      if (!room) throw NOT_EXISTS_ROOM;

      validationUserByRoom(room.users, currentUserId, roomName, USER_PERMISSION.KICK);

      room.users = room.users.filter(userByRoom => userByRoom.id !== userId);

      await room.save();

      next();
      return res.json(util.success(`Success Kick User By Room`, `Success Kick ${userId.id} By Room: ${roomName}`));
    } catch (error) {
      const { code } = error;

      switch(code) {
        case EMPTY_ROOM_NAME.code:
          return res.json(util.fail(EMPTY_ROOM_NAME.code, EMPTY_ROOM_NAME.message));
        case USER_ID.code:
          return res.json(util.fail(USER_ID.code, USER_ID.message));
        case NOT_EXISTS_ID.code:
          return res.json(util.fail(NOT_EXISTS_ID.code, NOT_EXISTS_ID.message));
        case NOT_EXISTS_ROOM.code:
          return res.json(util.fail(NOT_EXISTS_ROOM.code, NOT_EXISTS_ROOM.message));
        case NOT_EXISTS_USER_BY_ROOM.code:
          return res.json(util.fail(NOT_EXISTS_USER_BY_ROOM.code, error.message));
        case PERMISSION_INSUFFICIENT.code:
          return res.json(util.fail(PERMISSION_INSUFFICIENT.code, PERMISSION_INSUFFICIENT.message));
        default:
          console.log(error);
          return res.json(util.fail(OTHER.code, OTHER.message));
      }
    }
  }
}