'use strict'

const Promise = require('bluebird')
const _ = require('lodash')

const getLocations = require('./getLocations')
const getHotelsByPath = require('./getHotelsByPath')
const getHotelItem = require('./getHotelItem')
const errors = require('../errors/classes')
const filterHotels = require('./filterHotels')
const limitHotels = require('./limitHotels')

function getHotels (req, res) {
  if (!req.body.cities || !req.body.cities.length) {
    const err = new errors.BadRequest('Cities missing')
    return res.status(err.statusCode).send(err)
  }

  const filterOptions = {
    max_price: req.query.max_price || 100
  }

  const returnHeaders = {}
  const hotelResult = []
  const runLimit = limitHotels.bind(null, hotelResult)
  const hotelOptions = {
    // Add more stuff to get more detailed queries
    and_filter: '253',
    order: req.query.relevance || 'price',
    currency: req.query.currency || 'EUR',
    max_price: filterOptions.max_price,
    start_date: req.query.start_date,
    end_date: req.query.end_date
  }

  return Promise.map(req.body.cities, getLocations).map((location) => {
    location._embedded.locations = location._embedded.locations.filter(location => {
      return location.type === 'path'
    })
    return Promise.map(location._embedded.locations, (basicHotel) => {
      return getHotelsByPath(_.defaults({
        path: basicHotel.path
      }, hotelOptions)).then(runLimit)
    }, {
      concurrency: 4
    })
  }, {
    concurrency: 3
    // If we found enough entries, just ignore all running commands and return the result
  }).catch(errors.HardHotelSearchBreak, () => {}).then(() => {
    returnHeaders['X-Hotels-available'] = hotelResult.length
    return Promise.map(filterHotels(hotelResult, filterOptions), getHotelItem)
  }).then((results) => {
    // Add specific headers to the result if required
    // Note: currently we have a max of approximately 40 entries but this is not our true maximum
    // There might be more
    _.each(returnHeaders, (value, headerKey) => {
      res.append(headerKey, value)
    })
    return res.status(200).send(results)
  }).catch((err) => {
    console.error(err)
    if (err.statusCode) {
      return res.sendStatus(err.statusCode)
    }
    // Urgs :/
    res.sendStatus(500)
  })
}

module.exports = getHotels
