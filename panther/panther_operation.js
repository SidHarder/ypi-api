const moment = require('moment');
const hpv1618Handler = require('./hpv1618Handler');

const pantherOperation = {};

function processPantherOperation(args, cb) {
  switch (args[0].pantherOperation.method) {
    case 'submitResult':
      submitResult(args[0].pantherOperation, cb);
      break;   
    default:
      cb(null, { status: 'ERROR', message: 'Method Not Found.' });
      break;
  }
}

function submitResult (args, cb) {
  console.log(`Received Panther Result: `);
  console.log(args);

  switch(args.testName) {
    case 'GT HPV':
      hpv1618Handler.handleResult(args, cb);
      break;
  }

  cb(null, { status: 'Panther result has been submitted.' })
}


pantherOperation.submitResult = submitResult;
pantherOperation.processPantherOperation = processPantherOperation;
module.exports = pantherOperation;


