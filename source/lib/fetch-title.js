const http = require('http')
const https = require('https')

// eslint-disable-next-line max-lines-per-function
module.exports = function fetchTitle(href, cb, redirects = 0) {
  console.time('title-fetch')

  const client = href.startsWith('http:') ? http : https
  const req = client.get(href, res => {
    const { headers, statusCode } = res

    if (statusCode !== 200) {
      req.abort()

      if ([301, 302].includes(statusCode) && redirects < 2) {
        fetchTitle(headers.location, cb, redirects + 1)

        return
      } else {
        console.error(`Got ${statusCode} after ${redirects} redirects`)
      }
    }

    res.on('error', console.error)
    res.on('data', chunk => {
      const htmlData = chunk.toString()
      const title = htmlData.match(/<title.*?>(.+)<\/title>/i)[1].trim()

      if (title && title.length) {
        console.timeEnd('title-fetch')
        req.abort()
        cb(null, title)
      }

      req.abort()
    })
  })

  req.on('error', console.error)
}
