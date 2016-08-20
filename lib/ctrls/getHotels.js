'use strict'

const Promise = require('bluebird')

const getLocations = require('./getLocations')
const getHotelsByPath = require('./getHotelsByPath')
const errors = require('../errors/classes')
const filterHotels = require('./filterHotels')

function getHotels (req, res) {
  if (!req.query.origin || !req.query.destination) {
    const err = new errors.BadRequest('Origin or destination missing')
    return res.status(err.statusCode).send(err)
  }

  // Implement the options and pass them around
  const options = {}

  const hotelResult = []
  const runFilter = filterHotels.bind(null, hotelResult, options)

  // Mock cities for the moment
  const cities = ['berlin', 'düsseldorf', 'münchen', 'frankfurt', 'regensburg']
  // Implement missing citiy query.... then:
  return Promise.map(cities, getLocations).then((location) => {
    return Promise.map(location._embedded.locations, (basicHotel) => {
      return getHotelsByPath({
        // Add more stuff to get more detailed queries
        path: basicHotel.path
      }).then(runFilter)
    })
  }).catch(errors.HardHotelSearchBreak, () => {
    return res.status(200).send(hotelResult)
  }).catch(console.error) // Urgs :/
}

module.exports = getHotels
