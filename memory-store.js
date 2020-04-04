'use strict'

const calcNextResetTime = windowMs => {
  const d = new Date()
  d.setMilliseconds(d.getMilliseconds() + windowMs)
  return d
}

/**
 * Storage for IP rate limitation middleware.
 *
 * @param {number} [options]
 * @return {Function}
 * @api public
 */

module.exports = (windowMs) => {
  let hits = {}
  let resetTime = calcNextResetTime(windowMs)

  this.increment = (key, cb) => {
    if (hits[key]) {
      hits[key]++
    } else {
      hits[key] = 1
    }

    cb(null, hits[key], resetTime)
  }

  // simply reset ALL hits every windowMs
  const interval = setInterval(() => {
    hits = {}
    resetTime = calcNextResetTime(windowMs)
  }, windowMs)

  if (interval.unref) interval.unref()
}
