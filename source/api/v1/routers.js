const router = require('express').Router()
const controllers = require('./controllers')
const httpError = require('http-errors')
const rateLimit = require('express-rate-limit')
const logger = require('../../lib/logger')

/**
 * todo: улучшить обработку и отправку ошибок
 */

router.get('/follow/:alias', controllers.follow)
router.get('/aliases/:alias', controllers.getAlias)
router.get('/aliases', controllers.getAliases)

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  handler: (req, res, next) => {
    logger.error('Rate limiter triggered')
    next(httpError.TooManyRequests())
  }
})

router.post('/aliases', rateLimiter, controllers.newAlias)

router.use((req, res, next) => {
  if (res.locals.payload) {
    next()
  } else {
    next(httpError.NotFound())
  }
})

require('../../lib/reporters')(router)

module.exports = router
