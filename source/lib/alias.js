const Alias = require('../models/alias')
const constants = require('../i18n/error-codes')

module.exports.find = function (name) {
  return new Promise((resolve, reject) => {
    Alias.findById(name)
      .then(alias => {
        if (!alias) {
          reject(new Error(constants.ALIAS_NOT_FOUND))
        } else {
          resolve(alias)
        }
      })
  })
}

module.exports.create = function (name, href) {
  const _ = require('underscore')

  return new Promise((resolve, reject) => {
    Alias.create(
      _.omit({
        '_id': name,
        'href': href
      }, value => _.isUndefined(value))
    )
      .then(resolve)
      .catch(err => {
        if (err.code === constants.mongo.DUPLICATE_KEY) {
          err = new Error(constants.ALIAS_NAME_TAKEN)
        } else if ('errors' in err) {
          const reason = err.errors[Object.keys(err.errors)[0]].message
          err = new Error(reason)
        }

        reject(err)
      })
  })
}
