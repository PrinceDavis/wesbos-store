'use strict'
const mongoose = require('mongoose')
const schema = require('./schema')
const methods = require('./methods')

schema.statics.getTagsList = methods.getTagsList
module.exports = mongoose.model('User', schema)
