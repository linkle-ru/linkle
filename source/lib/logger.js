const realLogger = require('pino')({ prettyPrint: true })
const mockedLogger = {
  info() {
    realLogger.info('log() called with args: ' + JSON.stringify(arguments))
  },
  warn() {
    realLogger.info('warn() called with args: ' + JSON.stringify(arguments))
  },
  error() {
    realLogger.info('error() called with args: ' + JSON.stringify(arguments))
  }
}

const logger = process.env.NODE_ENV === 'testing' ? mockedLogger : realLogger

module.exports = logger
