let router = require('express').Router(),
    controllers = require('./controllers');

router.get('/', controllers.home);

module.exports = router;
