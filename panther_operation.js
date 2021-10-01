const pantherOperation = {}

function processPantherOperation(args, cb) {
  switch (args[0].pantherOperation.method) {
    case 'submitResult':
      submitResult(args[0].pantherOperation, cb)
      break    
    default:
      cb(null, { status: 'ERROR', message: 'Method Not Found.' })
      break
  }
}

function submitResult (args, cb) {
  console.log(`Received Panther Result: `);
  console.log(args);
  cb(null, { status: 'Panther result has been submitted.' })
}

pantherOperation.submitResult = submitResult;
pantherOperation.processPantherOperation = processPantherOperation;
module.exports = pantherOperation;