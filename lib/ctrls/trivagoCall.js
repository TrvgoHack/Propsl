'use strict'

const crypto = require('crypto')
const config = require('../config')
const request = require('request-promise')
const _ = require('lodash')
const fixDate = require('./fixDates')
const Promise = require('bluebird')

const protocol = 'https://'
const endpoint = 'api.trivago.com'

const maxRequests = new Map()

function doReq (query, path) {
  if (!path) {
    path = query
    query = {}
  }

  if (query.timestamp) {
    query.timestamp = new Date(query.timestamp)
    query.timestamp.setSeconds(query.timestamp.getSeconds() + 1)
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

  const currentCall = path + _.each(_.omit(['timestamp'], query), (value, key) => { return key + value })

  let currentRequestCount = maxRequests.get(currentCall) || 0

  maxRequests.set(currentCall, ++currentRequestCount)

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
    maxRequests.delete(currentCall)
    return JSON.parse(response.body)
  }).catch(err => {
    if (/SIGNATURE-MISMATCH/.test(err.message)) {
      if (maxRequests.get(currentCall) > 10) {
        return {}
      }
      return Promise.delay(10).then(() => doReq(query, path))
    }
    throw err
  })
}

module.exports = doReq
