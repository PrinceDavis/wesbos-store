const nodeMailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const promisefy = require('es6-promisify')

const transport = nodeMailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

const generateHtml = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options)
  return juice(html)
}

exports.send = async options => {
  const html = generateHtml(options.filename, options)
  const text = htmlToText.fromString(html)
  const mailOption = {
    from: 'Ossaija ThankGod <noreply@ossaijad.com>',
    to: options.user.email,
    subject: options.subject,
    html,
    text
  }
  const sendMail = promisefy(transport.sendMail, transport)
  return sendMail(mailOption)
}
