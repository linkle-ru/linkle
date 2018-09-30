const mongoose = require('mongoose')
const debug = require('debug')('url-short:main')
const bluebird = require('bluebird')
const morgan = require('morgan')
const app = require('./app')

// todo: надо через app.get('env')
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

// todo: избавиться от bluebird
mongoose.Promise = bluebird
const mongooseOptions = {
  useMongoClient: true,
  promiseLibrary: bluebird,
}

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

// todo: порт надо получать через app.get('port')
const port = process.env.PORT || 8080

app.listen(port)

debug(`Listening on port ${port}`)
