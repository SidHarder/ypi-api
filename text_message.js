var async = require('async');
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

function sendMultiple (args, cb) {
  var phoneNumbers = args[0].phoneNumbers;
  if (!phoneNumbers) {
    console.log(`An array of phone numbers was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `An array of phone numbers was not provided as an argument.` });
  }

  var message = args[0].message;
  if (!message) {
    console.log(`A message was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A message was not provided as an argument.` });
  }

  async.eachSeries(phoneNumbers, function (phoneNumber, outCb) {    
    var args = [{ phoneNumber: phoneNumber, message: message }];
    send(args, function (error, result) {
      if(error) {
        outCb(error);
      } else {
        outCb(null, result);
      }      
    });
  },
    function (err) {
      if (err) {
        console.error(err);
        cb(null, { status: 'ERROR', err });
      } else {
        cb(null, { status: 'OK', message: 'Multiple Texts were successfully sent.' });
      }      
    });
}

textMessage.send = send
textMessage.sendMultiple = sendMultiple
module.exports = textMessage