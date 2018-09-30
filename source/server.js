const mongoose = require('mongoose')
const debug = require('debug')('url-short:main')
const morgan = require('morgan')
const app = require('./app')

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
      debug('Successfully connected to MongoBD!')
    },
    (err) => {
      debug('MongoDB connection error:', err)
    }
  )

app.use(morgan('combined'))

const port = process.env.PORT || 8080

app.listen(port)

debug(`Listening on port ${port}`)