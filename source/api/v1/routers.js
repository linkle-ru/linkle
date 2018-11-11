const router = require('express').Router()
const controllers = require('./controllers')
const rateLimit = require('express-rate-limit')

/**
 * todo: http-errors
 */

router.get('/follow/:alias', controllers.follow)
router.get('/aliases/:alias', controllers.getAlias)

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  handler: (req, res, next) => {
    const err = new Error('too many requests')
    err.status = 429
    next(err)
  }
})

router.post('/aliases', rateLimiter, controllers.newAlias)

require('./reporters')(router)

module.exports = router
