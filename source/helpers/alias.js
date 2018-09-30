const Alias = require('../mongo/models/alias')
const _ = require('underscore')

module.exports.find = function (name) {
  return new Promise((resolve, reject) => {
    Alias.findById(name)
      .then(resolve)
      .catch(reject)
  })
}

module.exports.create = function (name, href) {
  return new Promise((resolve, reject) => {
    Alias.create(
      _.omit({
        '_id': name,
        'href': href
      }, (value) => _.isUndefined(value))
    )
      .then(resolve)
      .catch(reject)
  })
}
