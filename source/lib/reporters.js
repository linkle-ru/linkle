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
    pino.warn(resBody.reason || err)
  } catch (e) {
    pino.error(err)
    resBody.code = 'err'
  }

  let resStatus

  if (err.status) {
    resStatus = err.status
  } else if (errorCode) {
    resStatus = 400
  }

  res.status(resStatus || 500).json(resBody)
}

module.exports = router => {
  router.use(sendOk)
  router.use(sendErr)
}
