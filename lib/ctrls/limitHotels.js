'use strict'

const errors = require('../errors/classes')

function limitHotels (hotelList, maxTime, result) {
  hotelList.push(...result.hotels)
  if (hotelList.length >= 40) {
    throw new errors.HardHotelSearchBreak('Enough results found')
  } else if (hotelList.length >= 8 && Date.now() > maxTime) {
    throw new errors.HardHotelSearchBreak('Minimum number of hotels found after our internal timeout')
  }
}

module.exports = limitHotels
