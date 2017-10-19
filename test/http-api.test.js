let yank = require('supertest'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    rewire = require('rewire'),
    chance = new require('chance')();

let app = rewire('../app');

// Первым делом роняем базу
before((ready) => {
    mongoose.connection.dropDatabase(() => {
        ready();
    });
});

describe('Добавление новой ссылки', () => {
    describe('с кастомным именем', () => {
        it('разрешено, если это первая ссылка в базе', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'name': 'first',
                    'href': 'ya.ru'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body).to.have.property('name', 'first');
                    expect(res.body).to.have.property('href', 'http://ya.ru');
                })
                .end(done);
        });

        it('запрещено, если это дубль', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'name': 'first',
                    'href': 'google.com'
                })
                .expect(400)
                .end(done);
        });

        it('запрещено, если ссылка может зациклиться', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'name': 'loop',
                    'href': 'https://short.taxnuke.ru/loop'
                })
                .expect(400)
                .end(done);
        });

        it('запрещено, если алиас слишком длинный', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'name': chance.word({ length: 300 }),
                    'href': 'google.com'
                })
                .expect(400)
                .end(done);
        });

        it('запрещено, если алиас содержит странные символы', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'name': '@asasd',
                    'href': 'google.com'
                })
                .expect(400)
                .end(done);
        });

        it('запрещено, если сжимаемая ссылка слишком длинная', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'name': chance.word({ length: 5 }),
                    'href': chance.word({ length: 3000 })
                })
                .expect(400)
                .end(done);
        });

        it('запрещено, если сжимаемая ссылка пустая', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'name': chance.word({ length: 5 }),
                    'href': ''
                })
                .expect(400)
                .end(done);
        });
    });

    describe('с рандомным именем', () => {
        it('разрешено, если сжимаемая ссылка передана', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'href': chance.word({ length: 40 })
                })
                .expect(200)
                .end(done);
        });

        it('запрещено, если сжимаемая ссылка пустая', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'href': ''
                })
                .expect(400)
                .end(done);
        });

        it('запрещено, если сжимаемая ссылка слишком длинная', (done) => {
            yank(app)
                .post('/api/v1/aliases')
                .send({
                    'href': chance.word({ length: 2400 })
                })
                .expect(400)
                .end(done);
        });
    });
});

describe('Переход по короткой ссылке', () => {
    describe('из базы', () => {
        it('разрешено', (done) => {
            yank(app)
                .get('/first')
                .expect(302)
                .end((err, res) => {
                    yank(app)
                        .get(res.header.location)
                        .expect(301)
                        .end((err, res) => {
                            expect(res.header.location).equal('http://ya.ru');
                            done();
                        });
                });
        });
    });

    describe('не из базы', () => {
        it('запрещено', (done) => {
            yank(app)
                .get('/googleplex')
                .expect(302)
                .end((err, res) => {
                    yank(app)
                        .get(res.header.location)
                        .expect(400)
                        .end(done);
                });
        });
    });
});

// describe('Редактирование ссылки', () => {
//     it('запрещено, если ссылки с таким именем нет');
//     it('запрещено, если пользователь не авторизован');
//     it('запрещено, если новое содержимое слишком длинное');
//     it('запрещено, если новое содержимое не передано');
//     it('разрешено, если пользователь авторизован');
// });

// describe('Удаление ссылки', () => {
//     it('запрещено, если новое содержимое не передано');
//     it('запрещено, если пользователь не авторизован');
//     it('запрещено, если имя не передано');
//     it('запрещено, если такая не найдена');
//     it('разрешено, если пользователь авторизован');
// });

// describe('Аналитика ссылки', () => {
//     it('недоступна, если пользователь не авторизован');
//     it('доступна, если пользователь авторизован');
// });
