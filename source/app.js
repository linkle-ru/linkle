const express = require('express')
const path = require('path')
const chatops = require('./helpers/chatops')
const mongoose = require('mongoose')
const bluebird = require('bluebird')
const morgan = require('morgan')
const debug = require('debug')('url-short:main')
const requireDir = require('require-dir') // todo: может можно без?
const locales = requireDir('./i18n', { recurse: true })
const bodyParser = require('body-parser')

const app = express()

const env = process.env.NODE_ENV || 'production'

debug(`Node environment is set to "${env}"`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Прописываем заголовки для ответа
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'X-Powered-By': 'PHP/5.1.6'
  })

  next()
})

app.use(express.static(path.join(__dirname, 'gui/public')))

app.use((req, res, next) => {
  res.locals.locale = (locales[req.query.lang] || locales.en)

  next()
})

const api = require('./api/routers')

app.use('/api/v1', api)

app.get('/:alias', (req, res) => {
  res.redirect(`/api/v1/follow/${req.params.alias}`)
  res.status(301)
})

app.get('*', (req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404

  next(err)
})

// Конечный обработчик ошибок
app.use((err, req, res, next) => {
  // Вываливаем стэк только в окружении development
  res.locals.message = err.message
  res.locals.error = env === ('development') ? err : {}

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

let mongoUri, dbName

if (env === 'production') {
  const mLabUser = process.env.MLAB_USER
  const mLabPass = process.env.MLAB_PASS

  mongoUri = `mongodb://${mLabUser}:${mLabPass}@ds247327.mlab.com:47327/`
  dbName = 'url-shortener-production'
} else {
  mongoUri = 'mongodb://localhost:27017/'
  dbName = `url-shortener-${env}`
}

process.env.DB_URI = mongoUri + dbName

// Настраиваем Mongoose
mongoose.Promise = bluebird
const mongooseOptions = {
  // useNewUrlParser: true, // todo: обновить mongoose
  useMongoClient: true,
  promiseLibrary: bluebird,
}

if (env === 'testing') {
  // todo: код для тестов не должен быть здесь
  const Mockgoose = require('mockgoose').Mockgoose
  const mockgoose = new Mockgoose(mongoose)

  mockgoose.prepareStorage()
    .then(() => {
      mongoose.connect(process.env.DB_URI, mongooseOptions)
    })
} else {
  mongoose.connect(process.env.DB_URI, mongooseOptions)
    .then(
      () => {
        debug('Successfully connected to MongoBD!')
      },
      (err) => {
        debug('MongoDB connection error:', err)
      }
    )

  // Конфигурируем и подключаем логгер запросов/ответов
  const morganConfig = JSON.stringify({
    request: {
      date: ':date[clf]',
      ip: ':remote-addr',
      agent: ':user-agent',
      referrer: ':referrer',
      httpV: ':http-version',
      method: ':method',
      url: ':url',
      remoteUser: ':remote-user'
    },
    response: {
      status: ':status',
      responseTime: ':response-time'
    }
  })

  if (env === 'production') {
    app.use(morgan(morganConfig))
  } else {
    app.use(morgan('tiny'))
  }
}

const port = process.env.PORT || 8080

if (!module.parent) {
  app.listen(port)
}

debug(`Listening on port ${port}`)

module.exports = app
