const router = require('express').Router()
const controllers = require('./controllers')
const httpError = require('http-errors')
const cors = require('cors')
const bodyParser = require('body-parser')

router.get('/follow/:alias', controllers.follow)

router.use(cors())
router.get('/aliases/:alias', controllers.getAlias)
router.get('/aliases', controllers.getAliases)
router.post(
  '/aliases',
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  controllers.newAlias
)

// todo: investigate
router.use((_req, res, next) => {
  if (res.locals.payload) {
    next()
  } else {
    next(httpError.NotFound())
  }
})

require('../../lib/reporters')(router)

module.exports = router
