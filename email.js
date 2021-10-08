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

function send (args, cb) {
  var emailAddress = args[0].emailAddress;
  if (!emailAddress) {    
    return cb(null, { status: 'ERROR', message: `An email address was not provided as an argument.` });
  }

  var subject = args[0].subject;
  if (!subject) {    
    return cb(null, { status: 'ERROR', message: `A subject was not provided as an argument.` });
  }

  var message = args[0].message;
  if (!message) {    
    return cb(null, { status: 'ERROR', message: `A message was not provided as an argument.` });
  }

  let transporter = nodemailer.createTransport(mailConfig)
  let emailContent = {
    from: 'Yellowstone Pathology Institute <support@ypii.com>',
    to: emailAddress,
    subject: subject,
    text: message,
    html: `<p>${message}</p>`
  }

  transporter.sendMail(emailContent, function (error, info) {    
    if(error) {      
      console.error(error);
      return cb(null, { status: 'ERROR', message: error.message });
    } 
    return cb(null, { status: 'OK', info });
  })    
}

email.send = send;
module.exports = email;