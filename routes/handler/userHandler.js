const util = require('../../modules/util');

module.exports = {
  test: async (req, res) => {
    console.log(req);

    res.json(util.success('test', 'test'));
  }
}