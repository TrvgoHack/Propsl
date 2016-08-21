'use strict'

const Promise = require('bluebird')
const _ = require('lodash')

const getLocations = require('./getLocations')
const getHotelsByPath = require('./getHotelsByPath')
const errors = require('../errors/classes')
const filterHotels = require('./filterHotels')
const limitHotels = require('./limitHotels')

function getHotels (req, res) {
  if (!req.post.cities || !req.post.cities.length) {
    const err = new errors.BadRequest('Cities missing')
    return res.status(err.statusCode).send(err)
  }

  const filterOptions = {
    max_price: req.query.max_price || 100
  }

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

  return Promise.map(req.post.cities, getLocations).map((location) => {
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
    const results = filterHotels(hotelResult, filterOptions)
    return res.status(200).send(results)
  }).catch((err) => {
    if (err.statusCode) {
      return res.sendStatus(err.statusCode)
    }
    // Urgs :/
    res.sendStatus(500)
  })
}

module.exports = getHotels
