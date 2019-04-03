const cacheEnabled = (process.env.NODE_ENV === 'production')

if (cacheEnabled) {
  var redis = require('redis')
  var redisClient = redis.createClient()
} else {
  pino.warn('Redis is disabled...')
}

module.exports = {
  middleware: function (req, res, next) {
    if (!cacheEnabled) {
      next()

      return
    }

    const alias = req.params.alias

    redisClient.get(alias, (err, href) => {
      if (cacheEnabled && href != null && !err) {
        res.status(301).redirect(href)
        pino.info('Cache hit!')
      } else {
        next()
      }
    })
  },
  client: redisClient
}
