const logger = require('./logger')

function sendOk(req, res, next) {
  res.status(200).json({
    status: 'ok',
    payload: res.locals.payload
  })
}

function sendErr(err, req, res, next) {
  const resBody = {
    status: 'error'
  }

  const errorCode = err.message

  try {
    resBody.code = errorCode
    resBody.reason = res.locals.lang.errors[errorCode[0]][errorCode.substr(1)]
  } catch (e) {
    resBody.reason = err.message
  }

  if (process.env.NODE_ENV !== 'testing') {
    logger.warn(resBody.reason || err)
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
  router.use(sendOk)
  router.use(sendErr)
}
