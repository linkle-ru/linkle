const mongoose = require('mongoose')
const debug = require('debug')('url-short:main')
const bluebird = require('bluebird')
const morgan = require('morgan')
const app = require('./app')

// через app.get('env')
const env = process.env.NODE_ENV || 'production'

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
  useMongoClient: true,
  promiseLibrary: bluebird,
}

if (env === 'testing') {
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

  app.use(morgan('combined'))
}

// todo: порт надо получать через app.get('port')
const port = process.env.PORT || 8080

/**
 * Для мутационного тестирования, чтобы на одном порту не
 * развернуть несколько серверов
 */
if (!module.parent) {
  app.listen(port)
}

debug(`Listening on port ${port}`)

// todo: неочевидное решение
module.exports = app
