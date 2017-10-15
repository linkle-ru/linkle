let router = require('express').Router(),
    controllers = require('./controllers');

/**
 * Главный маршрут
 */
router.get('/goto/:alias', controllers.goto);


module.exports = router;
