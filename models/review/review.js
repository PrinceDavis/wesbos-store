'use strict'
const mongoose = require('mongoose')
const Schema = require('./schema')
const methods = require('./methods')

Schema.pre('find', methods.autopopulate)
Schema.pre('findOne', methods.autopopulate)

module.exports = mongoose.model('Review', Schema)
