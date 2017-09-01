'use strict'
const mongoose = require('mongoose')
const slug = require('slug')
const methods = require('./methods')

const schema = new mongoose.Schema({
  name: {type: String, trim: true, required: 'Please enter a store name'},
  slug: String,
  description: { type: String, trim: true },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  }
})

schema.pre('save', function (next) {
  if (!this.isModified('name')) return next()
  this.slug = slug(this.name)
  next()
  // todo make more resiliant so slugs are unique
})

module.exports = schema
