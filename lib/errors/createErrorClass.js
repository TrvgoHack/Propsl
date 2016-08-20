'use strict'

const util = require('util')

function createErrorClass (name, statusCode) {
  if (!name || !statusCode) {
    throw new Error('The name and the statusCode has to be provided')
  }

  const fn = function (message, errCode) {
    Error.call(this, message)
    Error.captureStackTrace(this, this.constructor)
    Object.defineProperty(this, 'message', {
      value: message || '',
      writable: true
    })
    if (errCode) {
      this.code = errCode
    }
  }

  util.inherits(fn, Error)

  Object.defineProperty(fn.prototype, 'name', {
    value: name,
    writable: false
  })
  Object.defineProperty(fn.prototype, 'statusCode', {
    value: statusCode,
    writable: false
  })

  return fn
}

module.exports = createErrorClass
