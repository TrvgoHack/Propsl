'use strict'

const crypto = require('crypto')
const config = require('../config')
const _ = require('lodash')
const request = require('request-promise')
const Promise = require('bluebird')

const method = 'GET'
const protocol = 'https://'
const endpoint = 'api.trivago.com'
const path = '/webservice/tas/hotels'

let runCounter = 0

function runRequest () {
  const startDate = new Date()
  const endDate = new Date(startDate)
  const hmac = crypto.createHmac('sha256', config.secretKey)

  endDate.setDate(new Date(startDate).getDate() + 7)

  const query = {
    access_id: config.accessID,
    end_date: endDate.toISOString(),
    start_date: startDate.toISOString(),
    timestamp: new Date().toISOString().split('.')[0] + 'Z'
  }

  let queryString = _.map(query, (value, key) => key + '=' + encodeURIComponent(value)).join('&')

  queryString += '&signature=' + hmac.update([method, endpoint, path, queryString].join('\n')).digest('base64')

  return request({
    url: protocol + endpoint + path + '?' + queryString,
    headers: {
      Accept: 'application/vnd.trivago.affiliate.hal+json;version=1',
      'Accept-Language': 'en-GB'
    },
    resolveWithFullResponse: true
  }).then(response => {
    if (response.statusCode === 202) {
      return runRequest()
    }
    runCounter = 0
    return response.body
  })
}

runRequest().then(console.log).catch(err => {
  if (/SIGNATURE-MISMATCH/.test(err.message) && runCounter < 100) {
    runCounter++
    return Promise.delay(25).then(runRequest)
  }
  throw err
})
