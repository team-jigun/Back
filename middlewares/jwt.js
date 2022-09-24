const jwt = require('jsonwebtoken');
const { secretKey, options } = require('./config/jwtOption');
const ERROR = require('../modules/ERROR');

module.exports = {
  sign: async user => {
    const payload = { id: user.id };

    const result = {
      token: jwt.sign(payload, secretKey, options)
    };

    return result;
  },
  verify: async token => {
    let decoded;

    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      const { message } = error;
      const { OTHER, TOKEN_EXPIRED, TOKEN_INVALID } = ERROR;

      let errorCode = OTHER.code;
      let errorMessage = OTHER.message;
      if (message === 'jwt expired') {
        errorCode = TOKEN_EXPIRED.code;
        errorMessage = TOKEN_EXPIRED.message;
      } else if (message === 'invalid token') {
        errorCode = TOKEN_INVALID.code;
        errorMessage = TOKEN_INVALID.message;
      }

      console.log(errorMessage);
      return errorCode;
    }

    return decoded;
  }
}