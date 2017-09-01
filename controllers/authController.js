'use strict'
const passport = require('passport')

exports.log = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'failed Login!',
  successRedirect: '/',
  successFlash: 'You are logged in!'
})
