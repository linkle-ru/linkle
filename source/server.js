const app = require('./app')
const mongoose = require('mongoose')

if (app.get('env') === 'production') {
  const pinoExpress = require('express-pino-logger')()
  app.use(pinoExpress)
}

const defaultMongoUrl = 'mongodb://localhost:27017/url-shortener'
const mongoUri = process.env.MONGO_URI || defaultMongoUrl
const mongooseOptions = { useMongoClient: true }
const port = process.env.API_PORT
mongoose.Promise = Promise

function init() {
  mongoose.connect(mongoUri, mongooseOptions)
    .then(() => {
      pino.info('Successfully connected to MongoBD!')
    })
    .then(() => {
      app.listen(port, '0.0.0.0')
      pino.info(`Listening on port ${port}`)
    })
    .catch(err => {
      setTimeout(init, 5000)
      pino.info(`INIT ERROR: ${err}`)
    })
}

init()
