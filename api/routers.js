let router = require('express').Router(),
    controllers = require('./controllers');

////////////////////////
// Публичные маршруты //
////////////////////////

router.get('/goto/:alias', controllers.goto);

router.route('/aliases')
    .post(controllers.newAlias);

// Обработчик ошибок API
router.use((err, req, res, next) => {
    // Кидаем ошибку только в окружении development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Рендерим страницу с ошибкой
    res.status(err.status || 500);
    res.json(err.message);
});

module.exports = router;
