const logger = require('../../lib/logger')

function badJsonHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    err = new Error('d1')
    err.status = 400
  }

  next(err)
}

function sendOk(req, res, next) {
  const resBody = {
    status: 'ok',
    payload: res.locals.payload
  }

  res.status(200).json(resBody)
}

function sendErr(err, req, res, next) {
  if (process.env.NODE_ENV !== 'testing') {
    logger.error(err)
  }

  const
    errorCode = err.message,
    resBody = {
      status: 'error',
      code: errorCode,
      reason: res.locals.lang.errors[errorCode[0]][errorCode.substr(1)]
    }

  let resStatus

  if (err.status) {
    resStatus = err.status
  } else if (errorCode) {
    resStatus = 200
  }

  res.status(resStatus || 500).json(resBody)
}

module.exports = router => {
  router.use(badJsonHandler)
  router.use(sendOk)
  router.use(sendErr)
}
