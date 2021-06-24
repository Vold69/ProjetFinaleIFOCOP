const router = require('express').Router();
const auth = require('./auth');
const user = require('./user');
const post = require('./post');

router.use('/api/auth', auth);

router.use('/api/user', user);

router.use('/api/post', post);

module.exports = router;