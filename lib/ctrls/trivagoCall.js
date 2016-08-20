'use strict'

const crypto = require('crypto')
const config = require('../config')
const rp = require('request-promise')
const Q = require('q')
const _ = require('lodash')

var fixDate = function (date) {
  return (date).toISOString().split('.')[0] + 'Z'
}

const protocol = 'https://'
const endpoint = 'api.trivago.com'

function doReq (query, path) {
  const hmac = crypto.createHmac('sha256', config.SECRET_KEY)

  _.extend(query, {
    access_id: config.ACCESS_ID,
    timestamp: fixDate(new Date())
  })

  query = Object.keys(query).sort().map((key) => key + '=' + encodeURIComponent(query[key])).join('&')
  const unhashedSignature = ['GET', endpoint, path, query].join('\n')
  query += '&signature=' + hmac.update(unhashedSignature).digest('base64')
  const url = protocol + endpoint + path + '?' + query

  Q.spawn(function *() {
    try {
      const res = yield rp({
        uri: url,
        headers: {
          'Accept': 'application/vnd.trivago.affiliate.hal+json;version=1',
          'Accept-Language': 'en-GB'
        },
        resolveWithFullResponse: true
      })

      if (res.statusCode === 200) {
        return res.body
      } else { // res.statusCode === 202
        doReq()
      }
    } catch (err) {
      yield wait(100)
      doReq()
    }
  })
}

function wait (times) {
  return Q.promise((resolve, reject) => {
    console.log('waiting for ', times)
    setInterval(_ => resolve(), times)
  })
}

module.exports = doReq
