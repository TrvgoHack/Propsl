'use strict'

const trivagoCall = require('./trivagoCall')

function getLocations (location) {
  return trivagoCall({
    query: location
  }, '/webservice/tas/locations')
}

module.exports = getLocations
