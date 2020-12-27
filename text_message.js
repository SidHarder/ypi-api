var twilio = require('twilio');
var twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

var textMessage = {};

function send (args, cb) {
  console.log(`Running method sendTextMessage`);
  
  var phoneNumber = args[0].phoneNumber;
  if (!phoneNumber) {
    console.log(`A phone number was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A phone number was not provided as an argument.` });
  }

  var message = args[0].message;
  if (!message) {
    console.log(`A message was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A message was not provided as an argument.` });
  }

  twilioClient.messages
    .create({ body: message, to: '+1' + phoneNumber, from: process.env.TWILIO_PHONE_FROM })
    .then((message) =>
      cb(null, { status: 'OK', message: 'A text was successfully sent to: ' + '+1' + phoneNumber, messageId: message.sid }))
    .catch((error) => cb(null, { status: 'ERROR', error }));
}

textMessage.send = send
module.exports = textMessage