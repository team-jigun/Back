module.exports = {
  OTHER  : {
    code: 'Unknown',
    message: 'Unknown Error'
  },
  TOKEN_EXPIRED: {
    code: 'Expired Token',
    message: 'Token re-issuance required'
  },
  TOKEN_NOT_EXPIRED: {
    code: 'Not Expired Token',
    message: 'Not Expired Token'
  },
  TOKEN_INVALID: {
    code: 'Invalid Token',
    message: 'Invalid Token'
  },
  TOKEN_EMPTY: {
    code: 'Empty Token',
    message: 'Token is Empty'
  },
  TOKEN_OR_REFRESH_EMPTY: {
    code: 'Empty Token or Refresh Token',
    message: 'Token or Refresh Token is Empty'
  },
  WRONG_PASSWORD: {
    IN_KOREAN: {
      code: 'Include Korean',
      message: 'Must be password include only english & number'
    }
  },
  EMPTY_INFO: {
    USER_ID: {
      code: 'Empty User ID',
      message: 'User ID is required.'
    },
    USER_PASSWORD: {
      code: 'Empty User Password',
      message: 'User Password is required.'
    },
    USERNAME: {
      code: 'Empty Username',
      message: 'Username is required.'
    }
  },
  EXISTS_ID: {
    code: 'Exists User ID',
    message: 'The user id already exists.'
  },
  NOT_EXISTS_ID: {
    code: 'Not Exists User ID',
    message: 'The user id not exists.'
  },
  USER_INVALID: {
    code: 'Invalid User',
    message: 'Please login again'
  },
  SOCKET_ERROR: {
    EXISTS_ROOM: {
      code: 'Exists Room Name',
      message: 'The room name already exists.'
    },
    NOT_EXISTS_ROOM: {
      code: 'Not Exists Room Name',
      message: 'The room not exists.'
    },
    NOT_EXISTS_USER_BY_ROOM: {
      code: 'Not Exists User By This Room',
      message: 'The user not exists by this room: [#ROOM_NAME#].\nAfter add user this room retry this.'
    },
    EMPTY_ROOM_NAME: {
      code: 'Empty Room Name',
      message: 'Room Name is required.'
    }
  },
  PERMISSION_INSUFFICIENT: {
    code: 'Insufficient Permission',
    message: 'Please correct user permissions and try again.'
  }
}