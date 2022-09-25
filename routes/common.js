const router = require('express').Router();
const refresh = require('./handler/refresh');

router.get('/refresh', refresh);

module.exports = router;