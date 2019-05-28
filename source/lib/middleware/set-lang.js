const requireDir = require('require-dir')
const locales = requireDir('../../i18n', { recurse: true })

module.exports = function(req, res, next) {
  res.locals.lang = (locales[req.query.lang] || locales.en)
  next()
}
