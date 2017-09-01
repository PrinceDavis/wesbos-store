'use strict'
const mongoose = require('mongoose')
const md5 = require('md5')
const validator = require('validator')
const mongodbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose')

const Schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalide Email Address'],
    required: 'Please Supply an email address'
  },
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  photo: String
})

Schema.plugin(passportLocalMongoose, { usernameField: 'email' })
Schema.plugin(mongodbErrorHandler)
module.exports = Schema
