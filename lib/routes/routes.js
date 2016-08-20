'use strict'

const hotelCtrl = require('../ctrls/index')

module.exports = (app) => {
  app.get('/trip', hotelCtrl.getHotels)
}
