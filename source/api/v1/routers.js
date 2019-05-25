const router = require('express').Router()
const controllers = require('./controllers')
const httpError = require('http-errors')
const cors = require('cors')

router.get('/follow/:alias', controllers.follow)

router.use(cors())
router.get('/aliases/:alias', controllers.getAlias)
router.get('/aliases', controllers.getAliases)

router.post('/aliases', controllers.newAlias)

router.use((req, res, next) => {
  if (res.locals.payload) {
    next()
  } else {
    next(httpError.NotFound())
  }
})

require('../../lib/reporters')(router)

module.exports = router
