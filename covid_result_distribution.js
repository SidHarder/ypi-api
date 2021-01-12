var email = require('./email');
var encryptionOperation = require('./encryption_operation')
const textMessage = require('./text_message');
var text = require('./text_message')

var covidResultDistribution = {};

function sendText(args, cb) {
  console.log('Running sendText')
  console.log(args)
  const phoneNumber = args[0].phoneNumber;
  if (!phoneNumber) {
    console.log(`The phone number was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `The phone number was not provided as an argument` });
  }

  var reportNo = args[0].reportNo;
  if (!reportNo) {
    console.log(`A reportNo was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A reportNo was not provided as an argument.` });
  }

  encryptionOperation.createResultUrl([{ reportNo: reportNo }], function (error, result) {
    var message = `This is Yellowstone Pathology Institute.  Your SARS-CoV-2 PCR test result is ready.  Please click on the following link to review your result: ${result.url}`;
    textMessage.send([{ phoneNumber: phoneNumber, message: message }], function (error, result) {
      console.log(result)
      cb(null, { status: 'OK', message: 'A text was sent.' })
    })    
  })  
}

function sendEmail(args, cb) {
  cb(null, { status: 'OK', message: 'A text was sent.' })
}

covidResultDistribution.sendText = sendText;
covidResultDistribution.sendEmail = sendEmail;
module.exports = covidResultDistribution;