const aliasHelper = require('../../lib/alias')
const axios = require('axios')
const Alias = require('../../models/alias')

const getAlias = function (req, res, next) {
  aliasHelper.find(req.params.alias)
    .then(alias => {
      res.locals.payload = alias

      next()
    })
    .catch(next)
}

const getAliases = function (req, res, next) {
  const list = req.query.list.split(',')

  Alias.find({
    '_id': { $in: list }
  })
    .then(links => {
      res.locals.payload = links

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
        href: alias.href,
        title: null
      }

      return axios.get(alias.href)
    })
    .then(response => {
      const title = response.data.match(/<title.*?>(.*?)<\/title>/i)[1]

      if (title && title.length) {
        res.locals.payload.title = title
      }

      next()
    })
    .catch(next)
}

module.exports = {
  follow,
  newAlias,
  getAlias,
  getAliases
}
