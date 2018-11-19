const express = require('express')
const fallback = require('./lib/fallback')
const logger = require('./lib/logger')
const requireDir = require('require-dir')
const locales = requireDir('./i18n', { recurse: true })
const bodyParser = require('body-parser')
const cors = require('cors')

const env = process.env.NODE_ENV || 'production'
const app = express()

app.set('env', env)

logger.info(`Node environment is set to "${env}"`)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Мимикрируем под PHP
app.use((req, res, next) => {
  res.set('X-Powered-By', 'PHP/5.1.6')

  next()
})

app.use((req, res, next) => {
  res.locals.lang = (locales[req.query.lang] || locales.en)

  next()
})

app.use('/api/v1', require('./api/v1/routers'))

app.use('*', (req, res, next) => {
  // todo: http-errors
  let err = new Error('Not found')
  err.status = 404

  next(err)
})

app.use(fallback)

module.exports = app
