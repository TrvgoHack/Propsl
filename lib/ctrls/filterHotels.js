'use strict'

// Do magic stuff to filter out bad hotels
function filterHotels (hotelList, options) {
  hotelList.forEach(hotel => {
    hotel.own_rating = hotel.rating_value
    if (hotel.superior) {
      hotel.own_rating += 3
    }
    if (hotel.rating_count < 50) {
      hotel.own_rating -= 5
    }
    hotel.deal = hotel.deals.reduce((cur, deal) => {
      // Strip currency values for comparison
      const curPrice = +cur.price.formatted.replace(/[^0-9]/g, '')
      const dealPrice = +deal.price.formatted.replace(/[^0-9]/g, '')
      if (curPrice > dealPrice) {
        return deal
      }
      return cur
    })
    delete hotel.deals
    hotel.deal.rate_attributes.forEach(rateAttribute => {
      if (rateAttribute.positive) {
        hotel.own_rating++
      }
    })
    hotel.own_rating += Math.floor((+options.max_price - (+hotel.deal.price.formatted.replace(/[^0-9]/g, ''))) / 3)
  })

  return hotelList.sort((a, b) => {
    if (a.own_rating < b.own_rating) {
      return 1
    }
    return -1
  }).slice(0, 5)
}

module.exports = filterHotels
