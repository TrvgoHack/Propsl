'use strict'

const createErrorClass = require('./createErrorClass')

module.exports = {
  BadRequest: createErrorClass('BadRequest', 400),
  NotFound: createErrorClass('NotFound', 404),
  Forbidden: createErrorClass('Forbidden', 403),
  Unauthorized: createErrorClass('Forbidden', 401),
  SignatureMismatch: createErrorClass('SignatureMismatch', 500),
  HardHotelSearchBreak: createErrorClass('STOPP', 200)
}
