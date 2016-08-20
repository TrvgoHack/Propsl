'use strict'

module.exports = function fixDate (date) {
  return (date).toISOString().split('.')[0] + 'Z'
}
