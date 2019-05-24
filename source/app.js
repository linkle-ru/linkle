const express = require('express')
const httpError = require('http-errors')
const requireDir = require('require-dir')
const bodyParser = require('body-parser')
const cors = require('cors')

global.pino = require('pino')({ prettyPrint: true })

// refactor?
const locales = requireDir('./i18n', { recurse: true })

const env = process.env.NODE_ENV || 'production'
const app = express()
app.set('env', env)
pino.info(`Node environment is set to "${env}"`)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  // Мимикрируем под PHP
  res.set('X-Powered-By', 'PHP/5.1.6')
  res.set('API-Version', require('../package.json').version)
  next()
})

app.use((req, res, next) => {
  res.locals.lang = (locales[req.query.lang] || locales.en)
  next()
})

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.message.includes('JSON')) {
    pino.warn(`Invalid JSON received: "${err.body}"`)
    res.status(400).send('Invalid JSON')
  } else {
    next(err)
  }
})

app.use('/api/v1', require('./api/v1/routers'))

app.use('*', (req, res, next) => {
  next(httpError.NotFound())
})

require('./lib/reporters')(app)

module.exports = app
