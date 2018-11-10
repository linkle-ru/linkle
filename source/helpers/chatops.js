
const
  request = require('request'),
  debug = require('debug')('url-short:chatops')

let credentials = {
  telegramCO: {
    botToken: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT
  }
}

const notify = function(message) {
  request.post({
    url: credentials.telegramCO.botToken,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      'chat_id': credentials.telegramCO.chatId,
      'parse_mode': 'Markdown',
      'text': message
    })
  }, (error, response) => {
    if (error) {
      debug(response)
    }
  })
}

module.exports = {
  notify
}
