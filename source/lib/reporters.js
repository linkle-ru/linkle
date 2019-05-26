function sendOk(_req, res, _next) {
  res.status(200).json({
    status: 'ok',
    payload: res.locals.payload
  })
}

function sendErr(err, _req, res, _next) {
  const resBody = {
    status: 'error'
  }

  const fullErrorCode = err.message

  try {
    resBody.code = fullErrorCode
    const errorType = fullErrorCode[0]
    const errorNumber = fullErrorCode.substr(1)
    resBody.reason = res.locals.lang.errors[errorType][errorNumber]
    pino.warn(resBody.reason || err)
  } catch (e) {
    pino.error(err + e)
    resBody.code = 'err'
  }

  let resStatus

  if (err.status) {
    resStatus = err.status
  } else if (fullErrorCode) {
    resStatus = 400
  }

  res.status(resStatus || 500).json(resBody)
}

module.exports = router => {
  router.use(sendOk)
  router.use(sendErr)
}
