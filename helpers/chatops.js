const
    request = require('request'),
    debug = require('debug')('url-short:chatops');

let credentials;

try {
    credentials = require('../credentials.json');
} catch (e) {
    credentials = {};
}

const notify = function(message) {
    console.log('2');
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
    }, (error, response, body) => {
        console.log(response);
        console.log(body);
        if (error) {
            debug(response);
        }
    });
};

module.exports = {
    notify
};
