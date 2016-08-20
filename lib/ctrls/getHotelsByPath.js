'use strict'

const fixDate = require('./fixDates')
const trivagoCall = require('./trivagoCall')

function getHotelsByPath (options) {
  options.startDate = options.startDate || new Date()

  if (!options.endDate) {
    options.endDate = new Date()
    options.endDate.setDate(options.startDate.getDate() + 1)
  }
  return trivagoCall({
    path: options.path,
    end_date: fixDate(options.endDate),
    start_date: fixDate(options.startDate),
    order: options.relevance || 'price',
    currency: options.currency || 'EUR',
    max_price: options.max_price || 100
  }, '/locations')
}

module.exports = getHotelsByPath
