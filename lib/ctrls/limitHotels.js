'use strict'

const errors = require('../errors/classes')

function limitHotels (hotelList, maxTime, result) {
  if (!result.length) {
    return
  }
  hotelList.push(...result.hotels)
  if (hotelList.length >= 40) {
    throw new errors.HardHotelSearchBreak('Enough results found')
  } else if (hotelList.length >= 8 && Date.now() > maxTime) {
    throw new errors.HardHotelSearchBreak('Minimum number of hotels found after our internal timeout')
  } else if (hotelList.length >= 2 && Date.now() > maxTime * 3) {
    throw new errors.HardHotelSearchBreak('Internal hard timeout')
  }
}

module.exports = limitHotels
