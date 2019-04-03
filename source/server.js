const mongoose = require('mongoose')
const app = require('./app')
const pinoExpress = require('express-pino-logger')()

if (app.get('env')=== 'production') {
  app.use(pinoExpress)
}

const mongoUri = `mongodb://localhost:${process.env.MONGO_PORT}/`
const dbName = 'url-shortener'

mongoose.Promise = Promise
const mongooseOptions = {
  useMongoClient: true
}

mongoose.connect(mongoUri + dbName, mongooseOptions)
  .then(
    () => {
      pino.info('Successfully connected to MongoBD!')
    },
    err => {
      throw new Error(`MongoDB connection error: ${err}`)
    }
  )

const port = process.env.API_PORT

app.listen(port)

pino.info(`Listening on port ${port}`)
