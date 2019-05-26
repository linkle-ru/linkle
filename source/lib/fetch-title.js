const http = require('http')
const https = require('https')
const zlib = require('zlib')
const { Unzip } = zlib

module.exports = function fetchTitle(href, cb, redirects = 0) {
  const client = href.startsWith('http:') ? http : https
  const req = client.get(href, res => {
    const { headers, statusCode } = res

    if (statusCode !== 200) {
      req.abort()

      if ([301, 302].includes(statusCode) && redirects < 2) {
        fetchTitle(headers.location, cb, redirects + 1)
      } else {
        console.error(`Got ${statusCode} after ${redirects} redirects`)
      }

      return
    }

    let chunks = ''
    let bodyIsGzipped = (headers['content-encoding'] === 'gzip')

    res.on('error', cb)

    if (bodyIsGzipped) {
      const unzipper = new Unzip()
      res.pipe(unzipper)
        .on('data', bodyParser)
        .on('error', cb)
    } else {
      res.on('data', bodyParser)
    }

    function bodyParser(chunk) {
      chunks += chunk.toString()
      const matches = chunks.match(/<title.*?>(.+)<\/title>/i)

      if (matches) {
        const title = matches[1].trim()
        cb(null, title || 'No title')
        this.destroy()
        req.abort()
      }
    }
  })

  req.on('error', cb)
}
