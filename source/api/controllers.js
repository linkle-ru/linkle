'use strict'

const aliasHelper = require('../helpers/alias')

const getAlias = function (req, res, next) {
  aliasHelper.find(req.params.alias)
    .then(alias => {
      res.locals.payload = alias

      next()
    })
    .catch(next)
}

const follow = function (req, res, next) {
  aliasHelper.find(req.params.alias)
    .then(alias => {
      alias.analytics.followed++
      alias.markModified('analytics')
      alias.save()

      res.status(301).redirect(alias.href)
    })
    .catch(next)
}

/**
 * Создание новой короткой ссылки
 */
const newAlias = function (req, res, next) {
  const name = req.body.name && req.body.name.toLowerCase()
  const href = req.body.href

  aliasHelper.create(name, href)
    .then(alias => {
      res.locals.payload = {
        name: alias._id,
        href: alias.href
      }

      next()
    })
    .catch(next)
}

module.exports = {
  follow,
  newAlias,
  getAlias
}
