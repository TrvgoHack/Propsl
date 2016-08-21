'use strict'

const fixDate = require('./fixDates')
const trivagoCall = require('./trivagoCall')

function getHotelsByPath (options) {
  options.start_date = options.start_date || new Date()

  if (!options.end_date) {
    options.end_date = new Date()
    options.end_date.setDate(options.start_date.getDate() + 1)
    options.end_date = fixDate(options.end_date)
  }

  options.start_date = fixDate(options.start_date)

  return trivagoCall(options, '/webservice/tas/hotels')
}

module.exports = getHotelsByPath
