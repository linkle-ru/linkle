const http = require('http')
const https = require('https')

// eslint-disable-next-line max-lines-per-function
module.exports = function fetchTitle(href, cb, redirects = 0) {
  const client = href.startsWith('http:') ? http : https
  const req = client.get(href, res => {
    const { headers, statusCode } = res
    let chunks = ''

    if (statusCode !== 200) {
      req.abort()

      if ([301, 302].includes(statusCode) && redirects < 2) {
        fetchTitle(headers.location, cb, redirects + 1)

        return
      } else {
        console.error(`Got ${statusCode} after ${redirects} redirects`)
      }
    }

    res.on('error', cb)
    res.on('data', chunk => {
      chunks += chunk.toString()

      const matches = chunks.match(/<title.*?>(.+)<\/title>/i)

      if (matches) {
        const title = matches[1].trim()

        cb(null, title || 'No title')
        req.abort()
      }
    })
  })

  req.on('error', cb)
}
