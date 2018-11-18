const logger = require('./logger')
const axios = require('axios')

let credentials = {
  telegramCO: {
    botToken: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT
  }
}

const notify = function (message) {
  axios
    .post(credentials.telegramCO.botToken, {
      chat_id: credentials.telegramCO.chatId,
      parse_mode: 'Markdown',
      text: message
    })
    .catch(logger.error)
}

module.exports = {
  notify
}
