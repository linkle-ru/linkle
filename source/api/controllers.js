const aliasHelper = require('../helpers/alias')
const constants = require('../helpers/constants')

const getAlias = function (req, res, next) {
  aliasHelper.find(req.params.alias)
    .then((alias) => {
      if (!alias) {
        next(new Error(constants.ALIAS_NOT_FOUND))
      } else {
        res.locals.payload = alias

        next()
      }
    })
    .catch((error) => {
      next(error)
    })
}

const follow = function (req, res, next) {
  aliasHelper.find(req.params.alias)
    .then((alias) => {
      if (!alias) {
        next(new Error(constants.ALIAS_NOT_FOUND))
      } else {
        alias.analytics.followed++
        alias.markModified('analytics')
        alias.save()

        res.status(301).redirect(alias.href)
      }
    })
    .catch((error) => {
      next(error)
    })
}

/**
 * Создание новой короткой ссылки
 */
const newAlias = function (req, res, next) {
  const name = req.body.name && req.body.name.toLowerCase()
  const href = req.body.href

  aliasHelper.create(name, href)
    .then((alias) => {
      res.locals.payload = {
        name: alias._id,
        href: alias.href
      }

      next()
    })
    .catch((err) => {
      // todo: коды ошибок мангуста надо оформить в константы
      if (err.code === 11000) {
        err = new Error(constants.ALIAS_NAME_TAKEN)
      } else if ('errors' in err) {
        const reason = err.errors[Object.keys(err.errors)[0]].message
        err = new Error(reason)
      }

      next(err)
    })
}

module.exports = {
  follow,
  newAlias,
  getAlias
}
