const aliasHelper = require('../../lib/alias')
const fetchTitle = require('../../lib/fetch-title')
const constants = require('../../i18n/error-codes')

const getAlias = function (req, res, next) {
  aliasHelper.find(req.params.alias)
    .then(alias => {
      res.locals.payload = alias
      next()
    })
    .catch(next)
}

const getAliases = function (req, res, next) {
  if (!req.query.list) {
    next(new Error(constants.BAD_LINK_LIST))
  } else {
    const list = req.query.list.split(',')
    const aliasModel = require('../../models/alias')

    aliasModel.find({ '_id': { $in: list } })
      .then(links => {
        res.locals.payload = links
        next()
      })
      .catch(next)
  }
}

const follow = function (req, res, next) {
  aliasHelper.find(req.params.alias.toLowerCase())
    .then(alias => {
      res.status(301).redirect(alias.href)

      alias.analytics.followed++
      alias.markModified('analytics')
      alias.save()
    })
    .catch(next)
}

const newAlias = function (req, res, next) {
  const name = req.body.name && req.body.name.toLowerCase()
  const href = req.body.href

  aliasHelper.create(name, href)
    .then(alias => {
      res.locals.payload = {
        name: alias._id,
        href: alias.href,
        title: null
      }

      fetchTitle(alias.href, (e, title) => {
        if (e) {
          next(new Error(constants.LINK_BROKEN))

          return
        }

        res.locals.payload.title = title

        next()
      })
    })
    .catch(next)
}

module.exports = { follow, newAlias, getAlias, getAliases }
