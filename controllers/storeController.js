'ust strict'
const mongoose = require('mongoose')
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
  res.render('index', {title: 'Home page'})
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' })
}

exports.getStores = async (req, res) => {
  const stores = await Store.find()
  res.render('stores', {title: 'Stores', stores})
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save()
  req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)
  res.redirect(`/stores/${store.slug}`)
}

exports.editStore = async (req, res) => {
  const store = await Store.findById(req.params.id)
  res.render('editStore', {title: `Edit ${store.name}`, store})
}

exports.updateStore = async (req, res) => {
  const store = await Store.findOneAndUpdate(
    {_id: req.params.id},
    req.body,
    {new: true, runValidators: true}
  ).exec()
  req.flash('success', `Successfully updated ${store.name}. <a href="/stores/${store.slug}">View Store</a>`)
  res.redirect(`/stores/${store._id}/edit`)
}
