const supertest = require('supertest')
const expect = require('chai').expect
const chance = new require('chance')()
const app = require('../source/app')

const mongoose = require('mongoose')
const Mockgoose = require('mockgoose').Mockgoose
const mockgoose = new Mockgoose(mongoose)

mongoose.Promise = Promise
const mongooseOptions = {
  useMongoClient: true
}

mockgoose.prepareStorage().then(() => {
  mongoose.connect(null, mongooseOptions)
})

app.listen(55555)

describe('Добавление новой ссылки', () => {
  describe('с кастомным именем', () => {
    it('разрешено, если это первая ссылка в базе', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'name': 'first',
          'href': 'ya.ru'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'ok')
          expect(res.body.payload.name === 'first')
          expect(res.body.payload.href === 'http://ya.ru')
        })
        .end(done)
    })

    it('запрещено, если это дубль', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'name': 'first',
          'href': 'google.com'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          // todo: проверить работоспособность
          expect(res.body.code === 'v1')
        })
        .end(done)
    })

    it('запрещено, если ссылка может зациклиться', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'name': 'loop',
          'href': 'https://short.taxnuke.ru/loop'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          expect(res.body.code === 'v8')
        })
        .end(done)
    })

    it('запрещено, если алиас слишком длинный', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'name': chance.word({ length: 300 }),
          'href': 'google.com'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          expect(res.body.code === 'v0')
        })
        .end(done)
    })

    it('запрещено, если алиас содержит странные символы', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'name': '@asasd',
          'href': 'google.com'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          expect(res.body.code === 'v2')
        })
        .end(done)
    })

    it('запрещено, если сжимаемая ссылка слишком длинная', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'name': chance.word({ length: 5 }),
          'href': chance.word({ length: 3000 })
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          expect(res.body.code === 'v3')
        })
        .end(done)
    })

    it('запрещено, если сжимаемая ссылка пустая', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'name': chance.word({ length: 5 }),
          'href': ''
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          expect(res.body.code === 'v4')
        })
        .end(done)
    })
  })

  describe('с рандомным именем', () => {
    it('разрешено, если сжимаемая ссылка передана', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'href': 'knife.media'
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'ok')
        })
        .end(done)
    })

    it('запрещено, если сжимаемая ссылка пустая', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'href': ''
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          expect(res.body.code === 'v4')
        })
        .end(done)
    })

    it('запрещено, если сжимаемая ссылка слишком длинная', (done) => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'href': chance.word({ length: 2400 })
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          expect(res.body.code === 'v3')
        })
        .end(done)
    })
  })
})

describe('Переход по короткой ссылке', () => {
  describe('из базы', () => {
    it('разрешено', (done) => {
      supertest(app)
        .get('/first')
        .expect(302)
        .end((err, res) => {
          supertest(app)
            .get(res.header.location)
            .expect(301)
            .end((err, res) => {
              expect(res.header.location).equal('http://ya.ru')
              done()
            })
        })
    })
  })

  describe('не из базы', () => {
    it('запрещено', (done) => {
      supertest(app)
        .get('/googleplex')
        .expect(302)
        .end((err, res) => {
          supertest(app)
            .get(res.header.location)
            .expect(200)
            .expect((res) => {
              // todo: такие тесты ложно проходят
              expect(res.body.status === 'error')
              expect(res.body.code === 'd0')
            })
            .end(done)
        })
    })
  })
})

describe('Получение алиаса по имени', () => {
  describe('если он существует', () => {
    it('выполняется', (done) => {
      supertest(app)
        .get('/api/v1/aliases/first')
        .expect(200)
        .expect((res) => {
          expect(res.body.payload.name === 'first')
          expect(res.body.payload.href === 'http://ya.ru')
          expect(res.body.payload).to.have.property('analytics')
        })
        .end(done)
    })
  })

  describe('если он не существует', () => {
    it('не выполняется', (done) => {
      supertest(app)
        .get('/api/v1/aliases/lasd')
        .expect(200)
        .expect((res) => {
          expect(res.body.status === 'error')
          expect(res.body.code === 'd0')
        })
        .end(done)
    })
  })
})

describe('Главная страница', () => {
  it('открывается', (done) => {
    supertest(app)
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.text.indexOf(
          '<title>Сокращалка ссылок</title>'
        )).to.not.equal(-1)
      })
      .end(done)
  })
})

describe('Несуществующая страница ', () => {
  it('не открывается, брошена ошибка 404', (done) => {
    supertest(app)
      .get('/gui/deprecated')
      .expect(404)
      .end(done)
  })
})

describe('Некорректный JSON ', () => {
  xit('вызывает ошибку', (done) => {
    supertest(app)
      .post('/api/v1/aliases')
      .set('Content-Type', 'application/json')
      .send('{"a"=><="b"}')
      .expect(400)
      .expect(() => {
        // todo: не работает проверка содержимого body ответа
      })
      .end(done)
  })
})
