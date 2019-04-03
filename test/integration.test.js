/* eslint-disable */

const supertest = require('supertest')
const expect = require('chai').expect
const chance = new require('chance')()
const app = require('../source/app')

const mongoose = require('mongoose')
const Mockgoose = require('mockgoose').Mockgoose
const mockgoose = new Mockgoose(mongoose)

global.pino = {
    info() {},
    warn() {},
    error() {}
  }

const nock = require('nock')

nock(/^https?.+test/)
  .persist()
  .get(/./)
  .reply(200, 'test<title>test</title>test')

mongoose.Promise = Promise
const mongooseOptions = {
  useMongoClient: true
}

mockgoose.prepareStorage().then(() => {
  mongoose.connect(null, mongooseOptions)
    .then(
      () => {
        if (!module.parent) {
          app.listen(55555)
        }
      },
      err => {
        throw new Error(`Mockgoose connection failed: ${err}`)
      }
    )
})

describe('Добавление новой ссылки', () => {
  describe('с кастомным именем', () => {
    describe('разрешено, если:', () => {
      it('первая ссылка в базе', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': 'first',
            'href': 'ya.ru'
          })
          .expect(200, {
            status: 'ok',
            payload: {
              name: 'first',
              href: 'http://ya.ru',
              title: 'Яндекс'
            }
          }, done)
      })

      it('вторая ссылка в базе', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': 'second',
            'href': 'google.ru'
          })
          .expect(200, {
            status: 'ok',
            payload: {
              name: 'second',
              href: 'http://google.ru',
              title: 'Google'
            }
          }, done)
      })
    })

    describe('запрещено, если:', () => {
      it('дубль', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': 'first',
            'href': 'google.com'
          })
          .expect(400, {
            status: 'error',
            reason: 'Alias name is taken',
            code: 'v1'
          }, done)
      })

      it('дубль с другим регистром', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': 'First',
            'href': 'google.com'
          })
          .expect(400, {
            status: 'error',
            reason: 'Alias name is taken',
            code: 'v1'
          }, done)
      })

      it('ссылка может зациклиться', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': 'loop',
            'href': 'https://linkle.ru/loop'
          })
          .expect(400, {
            status: 'error',
            reason: 'Link may loop',
            code: 'v8'
          }, done)
      })

      for (const link of ['abc', 'a.b c', '1.2']) {
        it(`не ссылка (${link})`, done => {
          supertest(app)
            .post('/api/v1/aliases')
            .send({
              'name': 'loop',
              'href': link
            })
            .expect(400, {
              status: 'error',
              reason: 'Bad href',
              code: 'v7'
            }, done)
        })
      }

      it('алиас слишком длинный', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': chance.word({ length: 300 }),
            'href': 'google.com'
          })
          .expect(400, {
            status: 'error',
            reason: 'Alias name is too long',
            code: 'v0'
          }, done)
      })

      it('алиас пустой', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': '',
            'href': 'google.com'
          })
          .expect(400, {
            status: 'error',
            reason: 'Empty alias name',
            code: 'v5'
          }, done)
      })

      it('алиас содержит странные символы', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': '*#asasd',
            'href': 'google.com'
          })
          .expect(400, {
            status: 'error',
            reason: 'Incorrect alias name',
            code: 'v2'
          }, done)
      })

      it('сжимаемая ссылка слишком длинная', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': chance.word({ length: 5 }),
            'href': chance.word({ length: 3000 })
          })
          .expect(400, {
            status: 'error',
            reason: 'Link is too long',
            code: 'v3'
          }, done)
      })

      it('сжимаемая ссылка пустая', done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({
            'name': chance.word({ length: 5 }),
            'href': ''
          })
          .expect(400, {
            status: 'error',
            reason: 'Link is empty',
            code: 'v4'
          }, done)
      })

    })

  })

  describe('с рандомным именем', () => {
    const hrefs = require('./resources.json').hrefs

    for (const href of hrefs) {
      it(`разрешено, если сжимаемая ссылка валидная (${href.substr(0, 30)}...)`, done => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({ href })
          .expect(200)
          .end(done)
      }).timeout(5000)
    }

    it('запрещено, если сжимаемая ссылка пустая', done => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'href': ''
        })
        .expect(400, {
          status: 'error',
          reason: 'Link is empty',
          code: 'v4'
        }, done)
    })

    it('запрещено, если сжимаемая ссылка ведет в никуда', done => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'href': 'foajsdfasd.asdfas'
        })
        .expect(400, {
          status: 'error',
          reason: 'Link is broken',
          code: 'v9'
        }, done)
    })

    it('запрещено, если сжимаемая ссылка слишком длинная', done => {
      supertest(app)
        .post('/api/v1/aliases')
        .send({
          'href': chance.word({ length: 2400 })
        })
        .expect(400, {
          status: 'error',
          reason: 'Link is too long',
          code: 'v3'
        }, done)
    })
  })
})

describe('Переход по короткой ссылке', () => {
  describe('из базы', () => {
    it('разрешено', done => {
      supertest(app)
        .get('/api/v1/follow/first')
        .expect(301)
        .end((err, res) => {
          expect(res.header.location).equal('http://ya.ru')

          // иначе не успевает аналитика записаться для следующего теста
          setTimeout(() => {
            done()
          }, 1500)
        })
    })
  })

  describe('не из базы', () => {
    it('запрещено', done => {
      supertest(app)
        .get('/api/v1/follow/googleplex')
        .expect(400, {
          status: 'error',
          reason: 'Alias is not in database',
          code: 'd0'
        }, done)
    })
  })
})

describe('Получение алиаса по имени', () => {
  describe('если он существует', () => {
    it('выполняется', done => {
      supertest(app)
        .get('/api/v1/aliases/first')
        .expect(200, {
          status: 'ok',
          payload: {
            name: 'first',
            href: 'http://ya.ru',
            analytics: {
              followed: 1
            }
          }
        }, done)
    })
  })

  describe('если он не существует', () => {
    describe('на английском', () => {
      it('не выполняется', done => {
        supertest(app)
          .get('/api/v1/aliases/lasd')
          .expect(400, {
            status: 'error',
            reason: 'Alias is not in database',
            code: 'd0'
          }, done)
      })
    })

    describe('на русском', () => {
      it('не выполняется', done => {
        supertest(app)
          .get('/api/v1/aliases/lasd?lang=ru')
          .expect(400, {
            status: 'error',
            reason: 'Алиас не найден в базе',
            code: 'd0'
          }, done)
      })
    })
  })
})

describe('Несуществующая страница', () => {
  it('не открывается, брошена ошибка 404', done => {
    supertest(app)
      .get('/gui/deprecated')
      .expect(404)
      .end(done)
  })
})

describe('Рейтлимитер', () => {
  it('отрабатывает', done => {
    const promises = []

    for (let i = 0; i < 50; i++) {
      promises.push(new Promise((resolve, reject) => {
        supertest(app)
          .post('/api/v1/aliases')
          .send({ href: 'https://linkle.ru' })
          .expect(200)
          .end(e => {
            if (e) {
              reject(e)
            } else {
              resolve()
            }
          })
      }))
    }

    Promise.all(promises)
      .then(() => {
        done(new Error())
      })
      .catch(() => {
        done()
      })
  })
})

describe('Запрос данных', () => {
  describe('с пустым списком', () => {
    it('валится', done => {
      supertest(app)
        .get('/api/v1/aliases')
        .expect(400, {
          status: 'error',
          code: 'v10',
          reason: 'Bad link list'
        }, done)
    })
  })
  describe('по одной ссылке', () => {
    it('успешно отрабатывается', done => {
      supertest(app)
        .get('/api/v1/aliases?list=first')
        .expect(200, {
          status: 'ok',
          payload: [
            {
              analytics: {
                followed: 1
              },
              href: 'http://ya.ru',
              name: 'first'
            }
          ],
        }, done)
    })
  })

  describe('по двум ссылкам', () => {
    it('успешно отрабатывается', done => {
      supertest(app)
        .get('/api/v1/aliases?list=first,second')
        .expect(200, {
          status: 'ok',
          payload: [
            {
              analytics: {
                followed: 1
              },
              href: 'http://ya.ru',
              name: 'first'
            }, {
              analytics: {
                followed: 0
              },
              href: 'http://google.ru',
              name: 'second'
            }
          ],
        }, done)
    })
  })
})

describe('Некорректный JSON', () => {
  it('вызывает ошибку', done => {
    supertest(app)
      .post('/api/v1/aliases')
      .set('Content-Type', 'application/json')
      .send('{"a"=><="b"}')
      .expect(400)
      .end(done)
  })
})

describe('Стук в левый эндпоинт', () => {
  it('в api заканчивается ошибкой', done => {
    supertest(app)
      .get('/api/v1/info/total')
      .expect(404)
      .end(done)
  })

  it('от корня заканчивается ошибкой', done => {
    supertest(app)
      .get('/asdfasfas/asdfs')
      .expect(404)
      .end(done)
  })
})
