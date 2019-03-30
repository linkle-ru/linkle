const logger = require('./logger')
const cacheEnabled = process.env.NODE_ENV === 'production'

if (cacheEnabled) {
  var redis = require('redis')
  var redisClient = redis.createClient()
} else {
  logger.warn('Redis is disabled...')
}

module.exports = {
  middleware: function (req, res, next) {
    const alias = req.params.alias

    redisClient.get(alias, (err, href) => {
      if (cacheEnabled && href != null && !err) {
        logger.info('Cache hit!')
        res.status(301).redirect(href)
      } else {
        next()
      }
    })
  },
  client: redisClient
}
