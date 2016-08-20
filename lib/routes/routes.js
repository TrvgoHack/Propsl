'use strict'

const hotelCtrl = require('../ctrls/index')

module.exports = function (app) {
  app.get('/trip', hotelCtrl.getLocations)
}
