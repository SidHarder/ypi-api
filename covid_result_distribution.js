var email = require('./email');
var encryptionOperation = require('./encryption_operation')
const textMessage = require('./text_message');
var text = require('./text_message')

var covidResultDistribution = {};

function sendText(args, cb) {  
  const phoneNumber = args[0].phoneNumber;
  if (!phoneNumber) {  
    return cb(null, { status: 'ERROR', message: `The phone number was not provided as an argument` });
  }

  var reportNo = args[0].reportNo;
  if (!reportNo) {    
    return cb(null, { status: 'ERROR', message: `A reportNo was not provided as an argument.` });
  }

  var firstName = args[0].firstName;
  if (!firstName) {
    return cb(null, { status: 'ERROR', message: `A First Name was not provided as an argument.` });
  }

  encryptionOperation.createResultUrl([{ reportNo: reportNo }], function (error, result) {       
    var message = `${firstName}, this is Yellowstone Pathology Institute.  Your SARS-CoV-2 PCR test result is ready.  Please click on the following link to review your result: ${result.url}`;
    textMessage.send([{ phoneNumber: phoneNumber, message: message }], function (error, result) {      
      cb(null, { status: 'OK', message: 'A text was sent.' })
    })    
  })  
}

function sendEmail(args, cb) {  
  const emailAddress = args[0].emailAddress;
  if (!emailAddress) {    
    return cb(null, { status: 'ERROR', message: `The email address was not provided as an argument` });
  }

  var reportNo = args[0].reportNo;
  if (!reportNo) {    
    return cb(null, { status: 'ERROR', message: `A reportNo was not provided as an argument.` });
  }

  var firstName = args[0].firstName;
  if (!firstName) {
    return cb(null, { status: 'ERROR', message: `A First Name was not provided as an argument.` });
  }

  encryptionOperation.createResultUrl([{ reportNo: reportNo }], function (error, result) {
    var subject = `Your SARS-CoV-2 PCR test result is ready.`    
    var message = `${firstName}, This is Yellowstone Pathology Institute.  Your SARS-CoV-2 PCR test result is ready.  Please click on the following link to review your result: <a href=${result.url}>${result.url}</a>`;
    email.send([{ emailAddress: emailAddress, message: message, subject: subject }], function (error, result) {  
      if(error) {
        console.error(error);
        cb(null, { status: 'ERROR', message: error })
      } else {
        cb(null, { status: 'OK', message: 'An email was sent.' })
      }      
    })
  })  
}

covidResultDistribution.sendText = sendText;
covidResultDistribution.sendEmail = sendEmail;
module.exports = covidResultDistribution;