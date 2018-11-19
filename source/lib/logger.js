const pino = require('pino')

const realLogger = pino({
  prettyPrint: true
})

const mockedLogger = {
  info() {
    realLogger.info('log() called')
  },
  warn() {
    realLogger.info('warn() called')
  },
  error() {
    realLogger.info('error() called')
  }
}

let logger

if (process.env.NODE_ENV === 'testing') {
  logger = mockedLogger
} else {
  logger = realLogger
}

module.exports = logger
