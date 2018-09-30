const Alias = require('../mongo/models/alias')
const _ = require('underscore')

// todo: разгрузить экшены от логики
const getAlias = function (req, res, next) {
  Alias.findById(req.params.alias)
    .then((alias) => {
      if (!alias) {
        let err = new Error('d0')

        next(err)
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
  Alias.findById(req.params.alias)
    .then((alias) => {
      if (!alias) {
        let err = new Error('d0')

        next(err)
      } else {
        alias.analytics.followed++
        alias.markModified('analytics')
        alias.save()

        res.redirect(alias.href)
        res.status(301)

        return null
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
  Alias.create(
    // На лету формируем объект и отметаем пустые свойства
    _.omit({
      '_id': req.body.name,
      'href': req.body.href
    }, (value) => _.isUndefined(value))
  )
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
        err = new Error('v1')
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
