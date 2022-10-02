const jwt   = require('./jwt');
const { TOKEN_OR_REFRESH_EMPTY, TOKEN_EXPIRED, TOKEN_INVALID } = require('../modules/ERROR');
const util  = require('../modules/util');

const authUtil = {
  checkToken: async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.refresh) return res.json(util.fail(TOKEN_OR_REFRESH_EMPTY.code, TOKEN_OR_REFRESH_EMPTY.message));

    const token = req.headers.authorization.replace('Bearer ', '');
    const refreshToken = req.headers.refresh;

    const user = await jwt.verify(token);
    const isNotExpiredRefresh = await jwt.refreshVerify(refreshToken, user.id);
    if (user === TOKEN_EXPIRED.code) {
      return res.json(util.fail(TOKEN_EXPIRED.code, TOKEN_EXPIRED.message));
    } else if (user === TOKEN_INVALID.code || !isNotExpiredRefresh || user.id === undefined) {
      return res.json(util.fail(TOKEN_INVALID.code, TOKEN_INVALID.message));
    }

    req.id = user.id;
    next();
  },
  checkTokenSocket: async (req) => {
    if (!req.headers.authorization || !req.headers.refresh) throw TOKEN_OR_REFRESH_EMPTY;

    const token = req.headers.authorization.replace('Bearer ', '');
    const refreshToken = req.headers.refresh;

    const user = await jwt.verify(token);
    const isNotExpiredRefresh = await jwt.refreshVerify(refreshToken, user.id);
    if (user === TOKEN_EXPIRED.code) {
      throw TOKEN_EXPIRED;
    } else if (user === TOKEN_INVALID.code || !isNotExpiredRefresh || user.id === undefined) {
      throw TOKEN_INVALID;
    }
  }
}

module.exports = authUtil;