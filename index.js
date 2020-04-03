'use strict'

/**
 * Module dependencies.
 */

const numeral = require('numeral')

/**
 * Default filter method.
 */

const defaultFilter = ip =>
  !/^(fe80::|127.|192.168.|172.(1[6-9]|2\d|3[01])|10.)/i.test(ip)

/**
 * IP rate limitation middleware.
 *
 * @param {Object} [options]
 * @return {Function}
 * @api public
 */

module.exports = (options = {}) => {
  let { filter = defaultFilter, threshold = 1000 } = options
  if (typeof threshold === 'string') threshold = numeral(threshold)

  return async (ctx, next) => {
    const ip = ctx.ip

    // TODO
  }
}
