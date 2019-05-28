global.pino = require('pino')({ prettyPrint: true })

const express = require('express')
const httpError = require('http-errors')
const setHeaders = require('./lib/middleware/set-headers')
const setLang = require('./lib/middleware/set-lang')
const app = express()
pino.info(`Node environment is set to "${process.env.NODE_ENV}"`)

app.use(setHeaders)
app.use(setLang)

// todo: вынести в middleware
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    pino.warn(`Invalid JSON received: "${err.body}"`)
    res.status(400).send('Invalid JSON')
  } else {
    next(err)
  }
})

app.use('/api/v1', require('./api/v1/routers'))

app.use('*', (_req, _res, next) => {
  next(httpError.NotFound())
})

require('./lib/reporters')(app)

module.exports = app
