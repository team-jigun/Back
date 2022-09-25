const jwt   = require('./jwt');
const { TOKEN_EMPTY, TOKEN_EXPIRED, TOKEN_INVALID } = require('../modules/ERROR');
const util  = require('../modules/util');

const authUtil = {
  checkToken: async (req, res, next) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    const { refreshToken, id } = req.body;

    if (!token) {
      return res.json(util.fail(TOKEN_EMPTY.code, TOKEN_EMPTY.message));
    }

    const user = await jwt.verify(token);
    if (user === TOKEN_EXPIRED.code) {
      return res.json(util.fail(TOKEN_EXPIRED.code, TOKEN_EXPIRED.message));
    } else if (user === TOKEN_INVALID.code || user.id === undefined) {
      return res.json(util.fail(TOKEN_INVALID.code, TOKEN_INVALID.message));
    }

    req.id = user.id;
    next();
  }
}

module.exports = authUtil;