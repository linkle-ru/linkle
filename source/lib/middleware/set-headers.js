module.exports = function (_req, res, next) {
  // Мимикрируем под PHP
  res.set('X-Powered-By', 'PHP/5.1.6')
  res.set('API-Version', require('../../../package.json').version)
  next()
}
