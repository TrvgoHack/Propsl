'use strict'

const bluebird = require('bluebird')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const fs = require('fs')

const app = express()

bluebird.promisifyAll(fs)

// enable compression of delivered contents
app.use(compression({
  level: 9
}))

// deactivate auto caching everything
// let's do the caching on our own
app.set('etag', false)

// setup the serverside rendering-enine
// app.engine('html', consolidate.lodash)
// app.set('view engine', 'html')
// app.set('views', config.root + '/public/views')

// Trust the reverse proxy that we use!
app.enable('trust proxy')
// app.locals.deployVersion = config.deployVersion

// app.set('showStackError', true)

// use json formating
app.use(bodyParser.json())

// Add assets and language to local variables
app.use(function (req, res, next) {
  res.locals.language = 'de'

  res.header('Cache-Control', 'max-age=0, private')

  next()
})

morgan.token('date', function (req, res) {
  return new Date().toLocaleString()
})

app.use(morgan('date - :method - :url - :status - :response-time ms'))

// Validate pagination entries
// app.get('*', pagination)

// Read all routes files and require them
fs.readdirSync('./lib/routes/').forEach((route) => require('./routes/' + route)(app))

// Error handler for express errors
app.use(function (err, req, res, next) {
  // Treat as 404
  if (~err.message.indexOf('not found')) {
    return next()
  }
  res.sendStatus(500)
})

// Assume 404 since no middleware responded
app.use(function (req, res) {
  res.sendStatus(404)
})

app.listen(3000)

console.log('Node', process.version)
console.log('App started on port 3000')

module.exports = app

