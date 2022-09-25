const User = require('../Schema/User');
const router = require('express').Router();

const authUtil = require('../middlewares/auth').checkToken;
const { sign, refresh } = require('../middlewares/jwt');

const encodePassword = require('../modules/crypto');
const util = require('../modules/util');
const { OTHER, WRONG_PASSWORD: { IN_KOREAN }, EMPTY_INFO : { USER_ID, USER_PASSWORD, USERNAME }, EXISTS_ID, USER_INVALID } = require('../modules/ERROR');

const userHandler = require('./handler/userHandler');

router.post('/signUp', async (req, res) => {
  const { id, password, name } = req.body;

  try {
    if (!id) {
      throw USER_ID;
    } else if (!password) {
      throw USER_PASSWORD;
    } else if (!name) {
      throw USERNAME;
    }

    const encodedPassword = encodePassword(password);

    const isExistsUserId = await User.findOne({ id });
    if(isExistsUserId) throw EXISTS_ID;

    const user = new User({
      id, password: encodedPassword, name
    });

    await user.save();

    return res.json(util.success('Success SignUp', 'Success sign up!'));
  } catch(error) {
    const { code } = error;

    switch(code) {
      case USER_ID.code:
        return res.json(util.fail(USER_ID.code, USER_ID.message));
      case USER_PASSWORD.code:
        return res.json(util.fail(USER_PASSWORD.code, USER_PASSWORD.message));
      case USERNAME.code:
        return res.json(util.fail(USERNAME.code, USERNAME.message));
      case IN_KOREAN.code:
        return res.json(util.fail(IN_KOREAN.code, IN_KOREAN.message));
      case EXISTS_ID.code:
        return res.json(util.fail(EXISTS_ID.code, EXISTS_ID.message));
      default:
        console.log(error.message);
        return res.json(util.fail(OTHER.code, OTHER.message));
    }
  }
});

router.post('/signIn', async (req, res) => {
  const { id, password } = req.body;
  if (!id) {
    return res.json(util.fail(USER_ID.code, USER_ID.message));
  } else if (!password) {
    return res.json(util.fail(USER_PASSWORD.code, USER_PASSWORD.message));
  }

  try {
    const encodedPassword = encodePassword(password);
    const user = await User.findOne({ id, password: encodedPassword });

    const token = await sign(user);
    const refreshToken = await refresh();
    await User.updateOne({ id: user.id }, {$set: {refreshToken}});

    const options = {
      token, refreshToken
    };
    res.json(util.success('Success SignIn', 'Success sign in!', options));
  } catch (error) {
    const { code } = error;

    switch(code) {
      case USER_ID.code:
        return res.json(util.fail(USER_ID.code, USER_ID.message));
      case USER_PASSWORD.code:
        return res.json(util.fail(USER_PASSWORD.code, USER_PASSWORD.message));
      case IN_KOREAN.code:
        return res.json(util.fail(IN_KOREAN.code, IN_KOREAN.message));
      default:
        console.log(error);

        if (error.name === 'TypeError') {
          return res.json(util.fail(USER_INVALID.code, USER_INVALID.message));
        }

        console.log(error);
        
        return res.json(util.fail(OTHER.code, OTHER.message));
    }
  }
});

router.post('/test', authUtil, userHandler.test);

module.exports = router;