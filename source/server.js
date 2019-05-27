const mongoose = require('mongoose')
const app = require('./app')

if (app.get('env') === 'production') {
  const pinoExpress = require('express-pino-logger')()
  app.use(pinoExpress)
}

const mongoUri = 'mongodb://mongo:27017/url-shortener'
const mongooseOptions = { useMongoClient: true }
const port = process.env.API_PORT
mongoose.Promise = Promise
tryMongo()

function tryMongo() {
  mongoose.connect(mongoUri, mongooseOptions)
    .then(() => {
      pino.info('Successfully connected to MongoBD!')
      app.listen(port, '0.0.0.0')
      pino.info(`Listening on port ${port}`)
    })
    .catch(err => {
      setTimeout(tryMongo, 5000)
      pino.info(`MongoDB connection error: ${err}`)
    })
}
