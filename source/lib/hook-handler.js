const http = require('http')

module.exports = function () {
  if (process.env.NODE_ENV === 'production') {
    http.get({
      hostname: 'localhost',
      port: process.env.HOOK_PORT,
      path: '/'
    })
  }
}
