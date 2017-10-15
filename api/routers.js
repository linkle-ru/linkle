let router = require('express').Router(),
    controllers = require('./controllers');

/**
 * Главный маршрут
 */
router.get('/goto/:link', controllers.goto);

module.exports = router;
