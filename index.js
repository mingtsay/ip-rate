'use strict'

/**
 * Module dependencies.
 */

const numeral = require('numeral')
const MemoryStore = require('./memory-store')

/**
 * Default filter method.
 */

const defaultFilter = ctx =>
  !/^(127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|10\.)/i.test(ctx.ip)

/**
 * IP rate limitation middleware.
 *
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */

module.exports = (options = {}) => {
  let { filter = defaultFilter, threshold = 1000, windowMs = 3600000 } = options
  if (typeof threshold === 'string') threshold = numeral(threshold)

  const store = options.store || new MemoryStore(windowMs)

  // ensure the store has required methods
  if (typeof store.increment !== 'function') {
    throw new Error('The storage is not valid.')
  }

  return async (ctx, next) => {
    if (!filter(ctx)) return await next()

    const ip = ctx.ip

    store.increment(ip, async (err, current, resetTime) => {
      if (err) return await next(err)

      ctx.ipRateLimit = {
        threshold: threshold,
        current: current,
        remaining: Math.max(threshold - current, 0),
        resetTime: resetTime
      }

      ctx.set('X-RateLimit-Remaining', ctx.ipRateLimit.remaining)
      ctx.set('X-RateLimit-Reset', resetTime.toUTCString())

      if (current > threshold) {
        ctx.set('Retry-After', resetTime.toUTCString())
        ctx.status = 429
      }

      await next()
    })
  }
}
