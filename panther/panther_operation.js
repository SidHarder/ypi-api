const moment = require('moment');

const hpvHandler = require('./hpv_handler');
const ngctHandler = require('./ngct_handler');
const trichHandler = require('./trich_handler');
const sarscov2Handler = require('./sarscov2_handler');
const hpv1618Handler = require('./hpv1618_handler');

const pantherOperation = {};

const resultHandlerMapp = [
  { testName: 'SARSCoV2', handler: sarscov2Handler.handleResult },
  { testName: 'HPV', handler: hpvHandler.handleResult },
  { testName: 'CT/GC', handler: ngctHandler.handleResult },
  { testName: 'TRICH', handler: trichHandler.handleResult },
  { testName: 'GT HPV', handler: hpv1618Handler.handleResult }
];

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
  if (args.testResults.length == 0) {
    return cb(null, { status: 'ERROR', message: `There doesn't appear to be results in this message.` });
  }
  
  var mappedTest = resultHandlerMapp.find((r) => r.testName == args.testName);
  if(mappedTest != undefined) {
    mappedTest.handler(args, cb);
  } else {
    cb(null, { status: 'ERROR', message: 'Test Type provided is not supported.' });
  }  
}

pantherOperation.submitResult = submitResult;
pantherOperation.processPantherOperation = processPantherOperation;
module.exports = pantherOperation;


