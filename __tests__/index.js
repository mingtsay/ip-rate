const request = require('supertest')
const assert = require('assert')
const crypto = require('crypto')
const Koa = require('koa')

const ipRate = require('..')

describe('IP Rate', () => {
  const string = crypto.randomBytes(1024).toString('hex')

  const sendString = (ctx, next) => {
    ctx.body = string
  }

  it('should send rate limit related headers', (done) => {
    const app = new Koa()

    app.use(ipRate({ filter: () => true }))
    app.use(sendString)

    request(app.listen()).get('/').expect(200).end((err, res) => {
      if (err) {
        return done(err)
      }

      assert.equal(res.headers['x-ratelimit-remaining'], '999')
      assert(res.headers['x-ratelimit-reset'])
      assert.equal(res.text, string)

      done()
    })
  })

  it('should return 429 when the threshold is reached', (done) => {
    const app = new Koa()

    app.use(ipRate({ filter: () => true, threshold: 1 }))
    app.use(sendString)

    request(app.listen()).get('/').expect(200).end((err, res) => {
      if (err) {
        return done(err)
      }

      assert.equal(res.headers['x-ratelimit-remaining'], '0')
      assert(res.headers['x-ratelimit-reset'])
      assert.equal(res.text, string)
    })

    request(app.listen()).get('/').expect(429).end((_, res) => {
      assert.equal(res.headers['x-ratelimit-remaining'], '0')
      assert(res.headers['x-ratelimit-reset'])
      assert(res.headers['retry-after'])
      assert.equal(res.text, string)

      done()
    })
  })
})
