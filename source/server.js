const mongoose = require('mongoose')
const app = require('./app')
const logger = require('./lib/logger')
const environments = require('../environments')
const pinoExpress = require('express-pino-logger')()

const env = app.get('env')

if (env === 'production') {
  app.use(pinoExpress)
}

const mongoUri = `mongodb://localhost:${environments[env].mongoPort}/`
const dbName = 'url-shortener'

mongoose.Promise = Promise
const mongooseOptions = {
  useMongoClient: true
}

mongoose.connect(mongoUri + dbName, mongooseOptions)
  .then(
    () => {
      logger.info('Successfully connected to MongoBD!')
    },
    err => {
      throw new Error(`MongoDB connection error: ${err}`)
    }
  )

const port = process.env.PORT || environments[env].serverPort

app.listen(port)

logger.info(`Listening on port ${port}`)
