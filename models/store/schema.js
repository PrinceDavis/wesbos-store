'use strict'
const mongoose = require('mongoose')
const slug = require('slug')

const Schema = new mongoose.Schema({
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
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
})

Schema.index({
  name: 'text',
  description: 'text'
})

Schema.pre('save', async function (next) {
  if (!this.isModified('name')) return next()
  this.slug = slug(this.name)
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const storesWithSlug = await this.constructor.find({slug: slugRegEx})
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }
  next()
  // todo make more resiliant so slugs are unique
})

module.exports = Schema
