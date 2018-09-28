const router = require('express').Router(),
  bodyParser = require('body-parser'),
  controllers = require('./controllers')

// Конфигурируем парсеры body для запросов
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.get('/follow/:alias', controllers.follow)
router.get('/aliases/:alias', controllers.getAlias)
router.post('/aliases', controllers.newAlias)

// Перехватываем ошибку формата JSON и передаем дальше в своем формате
router.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    err = new Error('d1')
    err.status = 400
  }

  next(err)
})

// мидлвэр, отправляющий положительный ответ
router.use((req, res, next) => {
  const resBody = {
    status: 'ok',
    payload: res.locals.payload
  }

  res.status(200).json(resBody)
})

// мидлвэр-обработчик ошибок, отправляющий отрицательный ответ
router.use((err, req, res, next) => {
  const
    errorCode = err.message,
    resBody = {
      status: 'error',
      code: errorCode,
      // Временное решение
      reason: res.locals.locale.errors[errorCode[0]][errorCode.substr(1)]
    }

  let resStatus

  if (err.status) {
    resStatus = err.status
  } else if (errorCode) {
    resStatus = 200
  }

  res.status(resStatus || 500).json(resBody)
})

module.exports = router
