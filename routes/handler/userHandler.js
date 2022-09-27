const User = require('../../Schema/User');

const { EMPTY_INFO: { USER_ID, USERNAME }, USER_INVALID, OTHER } = require('../../modules/ERROR');
const util = require('../../modules/util');

module.exports = {
  changeUsername: async (req, res) => {
    try {
      const { id, name } = req.body;

      if (!id) {
        throw USER_ID;      
      } else if (!name) {
        throw USERNAME;
      }

      const user = await User.findOne({ id });

      if (id !== req.id) {
        console.log(req.id);
        throw USER_INVALID;
      }

      if (user.name !== name) {
        await User.updateOne({ id }, { $set: { name } });
      }

      return res.json(util.success('Success Change User Info', 'Success Change User Info'));
    } catch (error) {
      const { code } = error;

      switch(code) {
        case USER_ID.code:
          return res.json(util.fail(USER_ID.code, USER_ID.message));
        case USERNAME.code:
          return res.json(util.fail(USERNAME.code, USERNAME.message));
        case USER_INVALID.code:
          return res.json(util.fail(USER_INVALID.code, USER_INVALID.message));
        default:
          if (error.name === 'TypeError') {
            return res.json(util.fail(USER_INVALID.code, USER_INVALID.message));
          }

          console.log(error);
          return res.json(util.fail(OTHER.code, OTHER.message));
      }
    }
  }
}