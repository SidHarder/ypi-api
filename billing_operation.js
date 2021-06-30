const db = require('./database_operation.js')

const billingOperation = {}

function processBillingOperation(args, cb) {
  switch (args[0].billingOperation.method) {    
    case 'getCharges':
      getCharges(args[0].billingOperation, cb)
      break
    default:
      cb(null, { status: 'ERROR', message: 'Method Not Found.' })
      break
  }
}

function getCharges(args, cb) {
  var sql = `select * from tblPanelSetOrderCPTCodeBill where reportNo = '${args.reportNo}'`;
  db.executeSqlCommand(sql, function (error, result) {
    if (error) return cb(null, error);
    cb(null, result);
  })
}

billingOperation.getCharges = getCharges;
billingOperation.processBillingOperation = processBillingOperation;
module.exports = billingOperation;