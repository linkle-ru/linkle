module.exports = function () {
  if (process.env.NODE_ENV === 'production') {
    require('request')(`http://localhost:${process.env.HOOK_PORT}`)
  }
}
