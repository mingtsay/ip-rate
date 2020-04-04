const MemoryStore = require('../memory-store')

describe('MemoryStore', () => {
  it('sets the value to 1 on first increment', done => {
    const store = new MemoryStore(-1)
    const key = 'test-store'

    store.increment(key, (err, value) => {
      if (err) {
        done(err)
      } else {
        if (value === 1) {
          done()
        } else {
          done(new Error('increment did not set the key on the store to 1'))
        }
      }
    })
  })

  it('increments the key for the store each increment', done => {
    const store = new MemoryStore(-1)
    const key = 'test-store'

    store.increment(key, () => {
      store.increment(key, (err, value) => {
        if (err) {
          done(err)
        } else {
          if (value === 2) {
            done()
          } else {
            done(new Error('increment did not increment the store'))
          }
        }
      })
    })
  })

  describe('timeout', () => {
    const originalSetInterval = setInterval
    let timeoutId = 1
    let realTimeoutId

    beforeEach(() => {
      timeoutId = 1
      // eslint-disable-next-line  no-global-assign
      setInterval = function (callback, timeout) {
        realTimeoutId = originalSetInterval(callback, timeout)
        return timeoutId++
      }
    })

    it('can run in electron where setInterval does not return a Timeout object with an unset function', done => {
      const store = new MemoryStore(-1)
      const key = 'test-store'

      store.increment(key, (err, value) => {
        if (err) {
          done(err)
        } else {
          if (value === 1) {
            done()
          } else {
            done(new Error('increment did not set the key on the store to 1'))
          }
        }
      })
    })

    afterEach(() => {
      // eslint-disable-next-line  no-global-assign
      setInterval = originalSetInterval
      clearTimeout(realTimeoutId)
    })
  })
})
