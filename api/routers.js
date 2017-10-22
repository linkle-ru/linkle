let router = require('express').Router(),
    controllers = require('./controllers');

router.get('/goto/:alias', controllers.goto);

router.get('/href/:alias', controllers.href);

router.route('/aliases')
    .post(controllers.newAlias);

// мидлвэр, отправляющий положительный ответ
router.use((req, res, next) => {
    const resBody = {
        status: 'ok',
        payload: res.locals.payload
    };

    res.status(200).json(resBody);
});

// мидлвэр-обработчик ошибок, отправляющий отрицательный ответ
router.use((err, req, res, next) => {
    const resBody = {
        status: 'error',
        code: err.code,
        reason: err.message
    };

    res.status(err.status || 500).json(resBody);
});

module.exports = router;
