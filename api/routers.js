let router = require('express').Router(),
    controllers = require('./controllers');

////////////////////////
// Публичные маршруты //
////////////////////////

router.get('/goto/:alias', controllers.goto);

router.route('/aliases')
    .post(controllers.newAlias);

module.exports = router;
