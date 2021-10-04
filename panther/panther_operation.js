const moment = require('moment');

const sarscov2Handler = require('./sarscov2_handler');
const hpv1618Handler = require('./hpv1618_handler');

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
  switch(args.testName) {
    case 'SARSCoV2':
      sarscov2Handler.handleResult(args, cb);      
      break;
    //case 'GT HPV':
    //  hpv1618Handler.handleResult(args, cb);
    //  break;
    default:
      cb(null, { status: 'ERROR', message: 'Test Type provided is not supported.' });
  }  
}

pantherOperation.submitResult = submitResult;
pantherOperation.processPantherOperation = processPantherOperation;
module.exports = pantherOperation;


