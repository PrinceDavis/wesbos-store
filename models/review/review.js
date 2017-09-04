'use strict'
const mongoose = require('mongoose')
const Schema = require('./schema')
// const methods = require('./methods')

module.exports = mongoose.model('Review', Schema)
