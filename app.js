// Подключаем зависимости
const express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    bluebird = require('bluebird'),
    request = require('request'),
    morgan = require('morgan'),
    debug = require('debug')('url-short:main'),
    requireDir = require('require-dir'),
    locales = requireDir('./i18n', {recurse: true});

// Создаем экземпляр приложения на Express
let app = express();

// Настраиваем переменные окружения
process.env.PORT = 3001;
let env = process.env.NODE_ENV || 'production';

debug(`Node environment is set to "${env}"`);

const mongoUri = 'mongodb://localhost:27017/',
    dbName = 'url-shortener' + '-' + env;

process.env.DB_URI = mongoUri + dbName;

// Настраиваем Mongoose
mongoose.Promise = bluebird;
const mongooseOptions = {
    useMongoClient: true,
    promiseLibrary: bluebird
};

if (env === 'testing') {
    const Mockgoose = require('mockgoose').Mockgoose;
    const mockgoose = new Mockgoose(mongoose);

    var credentials = {
        'telegramCO': {
            'botToken': null,
            'chatId': null
        }
    };

    mockgoose.prepareStorage()
        .then(() => {
            mongoose.connect(process.env.DB_URI, mongooseOptions);
        });
} else {
    var credentials = require('./credentials.json');
    mongoose.connect(process.env.DB_URI, mongooseOptions)
        .then(
            () => { debug('Succesfully connected to MongoBD!'); },
            (err) => { debug('MongoDB connection error:', err); }
        );

    // Конфигурируем и подключаем логгер запросов/ответов
    const morganConfig = JSON.stringify({
        request: {
            date: ':date[clf]',
            ip: ':remote-addr',
            agent: ':user-agent',
            referrer: ':referrer',
            httpV: ':http-version',
            method: ':method',
            url: ':url',
            remoteUser: ':remote-user'
        },
        response: {
            status: ':status',
            responseTime: ':response-time'
        }
    });

    if (env === 'production') {
        app.use(morgan(morganConfig));
    } else {
        app.use(morgan('tiny'));
    }
}

// Прописываем заголовки для ответа
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': 'PHP/5.1.6'
    });

    next();
});

// Настраиваем локаль пользователя
app.use((req, res, next) => {
    res.locals.locale = (locales[req.query.lang] || locales.en);

    next();
});

// Настраиваем роутинг
let api = require('./api/routers'),
    gui = require('./gui/routers');

app.use('/api/v1', api);
app.use('/', gui);

app.get('/:alias', (req, res) => {
    res.redirect('/api/v1/follow/' + req.params.alias);
    res.status(301);
});

// Генерим 404 и передаем обработчику ошибок
app.get('*', (req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;

    next(err);
});

// Раздаем из публичной директории GUI статику
app.use(express.static(path.join(__dirname, 'gui/public')));

// Указываем движок Pug для рендеринга вьюх и место, где их брать
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'gui/views'));

// Конечный обработчик ошибок
app.use((err, req, res, next) => {
    /* jshint unused:vars */
    // Вываливаем стэк только в окружении development или testing
    res.locals.message = err.message;
    res.locals.error = env === ('development' || 'testing') ? err : {};

    err.status = err.status || 500;

    let messageText = 'Ошибка провалилась до конечного обработчика:\n`' +
        JSON.stringify(err.status) + '`\n' +
        '`method:' + req.method + '`\n' +
        '`route:' + req.url + '`\n';

    if (env === 'production') {
        switch (err.status) {
            case 400:
            case 500:
                request.post({
                    url: credentials.telegramCO.botToken,
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        'chat_id': credentials.telegramCO.chatId,
                        'parse_mode': 'Markdown',
                        'text': messageText
                    })
                }, (error, response, body) => {
                    if (error) {
                        debug(response);
                    }
                });

                break;
        }
    }

    // Рендерим страницу с ошибкой
    res.status(err.status);
    res.send(err);
});

// Получаем порт
let port = process.env.PORT;

// Слушаем на порт 'port'
app.listen(port);

debug('Listening on port ' + port);

module.exports = app;
