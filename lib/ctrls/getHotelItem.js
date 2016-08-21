'use strict'

const trivagoCall = require('./trivagoCall')
const _ = require('lodash')

function getHotelsItem (hotel) {
  return trivagoCall('/webservice/tas/hotels/' + hotel.id).then((res) => {
    return _.defaults(hotel, res)
  })
}

module.exports = getHotelsItem
