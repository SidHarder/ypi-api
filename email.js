const nodemailer = require('nodemailer')

var mailConfig = {
  host: 'mail.ypii.com',
  port: 25,
  secure: false,  
  auth: {
    user: process.env.MAIL_AUTH_USER,
    pass: process.env.MAIL_AUTH_PASS
  },
  tls: {    
    rejectUnauthorized: false
  }
}

var email = {};

async function send (args, cb) {
  var emailAddress = args[0].emailAddress;
  if (!emailAddress) {
    console.log(`An email address was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `An email address was not provided as an argument.` });
  }

  var subject = args[0].subject;
  if (!subject) {
    console.log(`A subject was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A subject was not provided as an argument.` });
  }

  var message = args[0].message;
  if (!message) {
    console.log(`A message was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A message was not provided as an argument.` });
  }

  let transporter = nodemailer.createTransport(mailConfig)
  let emailContent = {
    from: 'support@ypii.com',
    to: emailAddress,
    subject: subject,
    text: message,
    html: `<p>${message}</p>`
  }

  let info = await transporter.sendMail(emailContent)  
  cb(null, { status: 'OK', message: `An email was sent to: ${emailAddress}` })
}

email.send = send;
module.exports = email;