const logger = require('../../lib/logger')

function sendOk(req, res, next) {
  const resBody = {
    status: 'ok',
    payload: res.locals.payload
  }

  res.status(200).json(resBody)
}

function sendErr(err, req, res, next) {
  if (process.env.NODE_ENV !== 'testing') {
    logger.warn(err)
  }

  const errorCode = err.message
  let resBody = {
    status: 'error'
  }

  try {
    resBody.code = errorCode
    resBody.reason = res.locals.lang.errors[errorCode[0]][errorCode.substr(1)]
  } catch (e) {
    resBody.reason = err.message
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
