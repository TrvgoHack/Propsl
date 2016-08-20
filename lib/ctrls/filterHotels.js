'use strict'

const errors = require('../errors/classes')

function filterHotels (hotelList, options, hotel) {
  // Do magic stuff to filter out shitty hotels
  hotelList.push(hotel)
  if (hotelList.length) {
    throw new errors.HardHotelSearchBreak('Enough results found')
  }
}

module.exports = filterHotels
