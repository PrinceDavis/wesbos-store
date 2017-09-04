'use strict'
exports.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
}

exports.getTopStores = function () {
  return this.aggregate([
    { $lookup: {
      from: 'reviews',
      localField: '_id',
      foreignField: 'store',
      as: 'reviews'}
    },
    { $match: { 'reviews.2': { $exists: true } } },
    { $project: {
      photo: '$$ROOT.photo',
      name: '$$ROOT.name',
      slug: '$$ROOT.slug',
      reviews: '$$ROOT.reviews',
      averageRating: { $avg: '$reviews.rating' }
    }},
    { $sort: { averageRating: -1 } },
    { $limit: 10 }
  ])
}

exports.autopopulate = function (next) {
  this.populate('reviews')
  next()
}
