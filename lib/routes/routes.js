'use strict'

const hotelCtrl = require('../ctrls/index')

module.exports = (app) => {
  app.post('/trip', hotelCtrl.getHotels)
}
