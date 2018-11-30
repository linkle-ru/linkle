const logger = require('./logger')

let credentials = {
  telegramCO: {
    botToken: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT
  }
}

const notify = function (message) {
  const axios = require('axios')

  axios
    .post(credentials.telegramCO.botToken, {
      chat_id: credentials.telegramCO.chatId,
      parse_mode: 'Markdown',
      text: message
    })
    .catch(logger.error)
}

module.exports = (err, req, res, next) => {
  logger.error(err)

  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {}

  err.status = err.status || 500

  if (process.env.NODE_ENV === 'production') {
    switch (err.status) {
    case 400:
    case 404:
    case 500:
      notify(`\`${err.status} method:${req.method} route:${req.url}\``)

      break
    }
  }

  res.status(err.status).send(err.message)
}
