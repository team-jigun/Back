const { sign, verify, refreshVerify } = require('../../middlewares/jwt');
const util = require('../../modules/util');
const { TOKEN_NOT_EXPIRED, TOKEN_OR_REFRESH_EMPTY, TOKEN_INVALID, TOKEN_EXPIRED, USER_INVALID } = require('../../modules/ERROR');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.headers.authorization && req.headers.refresh) {
    const token = req.headers.authorization.replace('Bearer ', '');
    const refreshToken = req.headers.refresh;

    const tokenResult = await verify(token);

    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.json(util.fail(TOKEN_INVALID.code, TOKEN_INVALID.message));
    }

    const refreshResult = await refreshVerify(refreshToken, decoded.id);
    if (tokenResult === TOKEN_EXPIRED.code) {
      if (!refreshResult) {
        return res.json(util.fail(USER_INVALID.code, USER_INVALID.message));
      } else {
        const newToken = await sign(decoded);

        return res.json(util.success('Success refresh access token', 'Success refresh access token', {token: newToken, refreshToken}));
      }
    } else {
      return res.json(util.fail(TOKEN_NOT_EXPIRED.code, TOKEN_NOT_EXPIRED.message));
    }
  } else {
    return res.json(util.fail(TOKEN_OR_REFRESH_EMPTY.code, TOKEN_OR_REFRESH_EMPTY.message));
  }
}