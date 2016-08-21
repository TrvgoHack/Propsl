'use strict'

const errors = require('../errors/classes')

function limitHotels (hotelList, result) {
  hotelList.push(...result.hotels)
  if (hotelList.length > 40) {
    throw new errors.HardHotelSearchBreak('Enough results found')
  }
}

module.exports = limitHotels
