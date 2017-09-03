'use strict'
const promisify = require('es6-promisify')
const passport = require('passport')
const User = require('mongoose').model('User')
const crypto = require('crypto')
const mail = require('../handlers/mail')

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'failed Login!',
  successRedirect: '/',
  successFlash: 'You are logged in!'
})

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'You are now logged out!')
  res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  }
  req.flash('error', 'Oops you must be logged in to do that!')
  res.redirect('/login')
}

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    req.flash('error', 'No account with that email address exists!')
    return res.redirect('/login')
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
  user.resetPasswordExpires = Date.now() + 3600000
  await user.save()
  const resetURL = `https://${req.headers.host}/account/reset/${user.resetPasswordToken}`
  await mail.send({
    user,
    filename: 'password-reset',
    subject: 'Password Reset',
    resetURL
  })
  req.flash('success', `You have been emailed a password reset link`)
  res.redirect('/login')
}

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()}
  })
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired')
    return res.redirect('/login')
  }
  res.render('reset', {title: 'Reset Your Password'})
}

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) return next()
  req.flash('error', 'Passwords do not match')
  res.redirect('back')
}

exports.update = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {$gt: Date.now()}
  })
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired')
    return res.redirect('/login')
  }
  const setPassword = promisify(user.setPassword, user)
  await setPassword(req.body.password)
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  const updatedUser = await user.save()
  await req.login(updatedUser)
  req.flash('success', 'Nice, Your password has been reset, now you are logged in')
  res.redirect('/')
}
