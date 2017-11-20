const
    request = require('request'),
    debug = require('debug')('url-short:chatops');

let credentials;

try {
    credentials = require('../credentials.json');
} catch (e) {
    credentials = {
        telegramCO: {
            botToken: 'https://api.telegram.org/123456789:AAAAA/sendMessage',
            chatId: '-1000987654321'
        }
    };
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
    }, (error, response, body) => { /* jshint unused:vars */
        if (error) {
            debug(response);
        }
    });
};

module.exports = {
    notify
};
