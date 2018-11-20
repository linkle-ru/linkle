const request = require('request')

module.exports = function () {
  if (process.env.NODE_ENV === 'production') {
    request(`http://localhost:${process.env.HOOK_PORT}`)
  }
}
