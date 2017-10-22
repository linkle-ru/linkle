const router = require('express').Router(),
    controllers = require('./controllers');

router.get('/follow/:alias', controllers.follow);
router.get('/aliases/:alias', controllers.getAlias);
router.post('/aliases', controllers.newAlias);

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
    const
        errorCode = err.message,
        resBody = {
            status: 'error',
            code: errorCode,
            // Временное решение
            reason: res.locals.locale.errors[errorCode[0]][errorCode.substr(1)]
        };

    res.status(err.status || 500).json(resBody);
});

module.exports = router;
