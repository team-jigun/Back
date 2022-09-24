const router = require('express').Router();
const authUtil = require('../middlewares/auth').checkToken;
const { OTHER, WRONG_PASSWORD: { IN_KOREAN }, EMPTY_INFO : { USER_ID, USER_PASSWORD, USERNAME }, EXISTS_ID } = require('../modules/ERROR');
const encodePassword = require('../modules/crypto');
const util = require('../modules/util');
const User = require('../Schema/User');

router.post('/signUp', async (req, res) => {
  const { id, password, name } = req.body;
  if (!id) {
    return res.json(util.fail(USER_ID.code, USER_ID.message));
  } else if (!password) {
    return res.json(util.fail(USER_PASSWORD.code, USER_PASSWORD.message));
  } else if (!name) {
    return res.json(util.fail(USERNAME.code, USERNAME.message));
  }

  try {
    const encodedPassword = encodePassword(password);

    const isExistsUserId = await User.findOne({ id });
    if(isExistsUserId) throw EXISTS_ID;

    const user = new User({
      id, password: encodedPassword, name
    });

    await user.save();

    res.json(util.success('Success SignUp', 'Success sign up!'));
  } catch(error) {
    console.log(error);

    if (error.code === IN_KOREAN.code) {
      res.json(util.fail(IN_KOREAN.code, IN_KOREAN.message));
    } else if (error.code === EXISTS_ID.code) {
      res.json(util.fail(EXISTS_ID.code, EXISTS_ID.message));
    } else {
      res.json(util.fail(OTHER.code, OTHER.message));
    }
  }
});

module.exports = router;