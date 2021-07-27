const db = require('./database_operation.js')

const billingOperation = {}

function processBillingOperation(args, cb) {
  switch (args[0].billingOperation.method) {    
    case 'getCharges':
      getCharges(args[0].billingOperation, cb)
      break
    case 'getClientBillingDetailReport':
      getClientBillingDetailReport(args[0].billingOperation, cb)
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

function getClientBillingDetailReport(args, cb) {
  var startDate = args.startDate;
  if (!startDate) {
    console.log(`A start date was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A start date was not provided as an argument.` });
  }

  var endDate = args.endDate;
  if (!endDate) {
    console.log(`An end date was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `An end date was not provided as an argument.` });
  }

  var clientGroupId = args.clientGroupId;
  if (!clientGroupId) {
    console.log(`A client group Id was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A client group Id was not provided as an argument.` });
  }

  var sql = `call prcGetClientBillingDetailReport_2('${startDate}', '${endDate}', ${clientGroupId})`;
  db.executeSqlCommand(sql, function (error, result) {
    if (error) return cb(null, error);
    cb(null, result);
  })
}

billingOperation.getCharges = getCharges;
billingOperation.processBillingOperation = processBillingOperation;
billingOperation.getClientBillingDetailReport;
module.exports = billingOperation;