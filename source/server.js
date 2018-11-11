const mongoose = require('mongoose')
const app = require('./app')
const logger = require('pino')()
const environments = require('../environments')

const env = app.get('env')

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
