'use strict'

const express = require('express')
const path = require('path')
const chatops = require('./helpers/chatops')
const debug = require('debug')('url-short:main')
const requireDir = require('require-dir') // todo: может можно без?
const locales = requireDir('./i18n', { recurse: true })
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const env = process.env.NODE_ENV || 'production'

app.set('env', env)

debug(`Node environment is set to "${env}"`)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Прописываем заголовки для ответа
app.use((req, res, next) => {
  res.set('X-Powered-By', 'PHP/5.1.6')

  next()
})

app.use(express.static(path.join(__dirname, 'gui/public')))

app.use((req, res, next) => {
  res.locals.locale = (locales[req.query.lang] || locales.en)

  next()
})

app.use('/api/v1', require('./api/routers'))

app.get('/:alias', (req, res) => {
  res.redirect(`/api/v1/follow/${req.params.alias}`)
  // todo: а может 308?
  res.status(301)
})

app.get('*', (req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404

  next(err)
})

// Конечный обработчик ошибок
// todo: тут ему не место
// todo: надо отлавливать другие методы запросов и кидать ошибки в ответах
app.use((err, req, res, next) => {
  // Вываливаем стэк только в окружении development
  res.locals.message = err.message
  res.locals.error = env === 'development' ? err : {}

  err.status = err.status || 500

  if (env === 'production') {
    switch (err.status) {
    case 400:
    case 404:
    case 500:
      chatops.notify(`\`${err.status} method:${req.method} route:${req.url}\``)

      break
    }
  }

  res.status(err.status)
  res.send(err)
})

module.exports = app
