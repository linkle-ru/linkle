const aliasHelper = require('../../lib/alias')
const constants = require('../../i18n/error-codes')
const Alias = require('../../models/alias')
const request = require('request')

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

    Alias.find({
      '_id': { $in: list }
    })
      .then(links => {
        res.locals.payload = links

        next()
      })
      .catch(next)
  }
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

      request(alias.href, (e, response, body) => {
        if (e) {
          next(new Error(constants.LINK_BROKEN))

          return
        }

        const title = body.match(/<title.*?>[\s\S]*?(\D*?)<\/title>/i)[1].trim()

        if (title && title.length) {
          res.locals.payload.title = title
        }

        next()

        if (process.env.NODE_ENV === 'production') {
          request(`http://localhost:${process.env.HOOK_PORT}`)
        }
      })
    })
    .catch(next)
}

module.exports = {
  follow,
  newAlias,
  getAlias,
  getAliases
}
