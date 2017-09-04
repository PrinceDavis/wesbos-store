'use strict'
exports.autopopulate = function (next) {
  this.populate('author')
  next()
}
