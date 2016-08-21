'use strict'

const crypto = require('crypto')
const config = require('../config')
const request = require('request-promise')
const _ = require('lodash')
const fixDate = require('./fixDates')
const Promise = require('bluebird')

const protocol = 'https://'
const endpoint = 'api.trivago.com'

function doReq (query, path) {
  if (!path) {
    path = query
    query = {}
  }

  if (query.timestamp) {
    query.timestamp = new Date(query.timestamp)
    query.timestamp.setSeconds(query.timestamp.getSeconds() + 3)
    query.timestamp = fixDate(query.timestamp)
  }
  _.assign(query, {
    access_id: config.ACCESS_ID,
    timestamp: query.timestamp || fixDate(new Date())
  })

  let queryString = Object.keys(query).sort().map((key) => key + '=' + encodeURIComponent(query[key])).join('&')
  const unhashedSignature = ['GET', endpoint, path, queryString].join('\n')
  queryString += '&signature=' + crypto.createHmac('sha256', config.SECRET_KEY).update(unhashedSignature).digest('base64')
  const url = protocol + endpoint + path + '?' + queryString

  return request({
    uri: url,
    headers: {
      'Accept': 'application/vnd.trivago.affiliate.hal+json;version=1',
      'Accept-Language': 'de-DE'
    },
    resolveWithFullResponse: true
  }).then((response) => {
    if (response.statusCode !== 200) {
      return doReq(query, path)
    }
    return JSON.parse(response.body)
  }).catch(err => {
    if (/SIGNATURE-MISMATCH/.test(err.message)) {
      return Promise.delay(15).then(() => doReq(query, path))
    }
    throw err
  })
}

module.exports = doReq
