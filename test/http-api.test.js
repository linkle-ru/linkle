let yank = require('supertest'),
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    rewire = require('rewire');

// let chance = new require('chance')();

let app = rewire('../app');

before((ready) => {
    mongoose.connection.dropDatabase(() => {
        ready();
    });
});

describe('Добавление новой ссылки', () => {
    it('выполняется, если это первая ссылка в базе', (done) => {
        yank(app)
            .post('/api/v1/aliases')
            .send({
                'name': 'first',
                'href': 'google.com'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body).to.have.property('name', 'first');
                expect(res.body).to.have.property('href', 'google.com');
            })
            .end(done);
    });

    it('не выполняется, если это дубль');
    it('не выполняется, если это алиас уже занят');
    it('не выполняется, если алиас содержит странные символы');
});
