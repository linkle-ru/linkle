const redis = require('redis')
const logger = require('./logger')
const cacheEnabled = process.env.NODE_ENV === 'production'
const redisClient = redis.createClient()

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
