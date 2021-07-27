const db = require('./database_operation.js')

const distributionOperation = {}

function processDistributionOperation(args, cb) {
  switch (args[0].distributionOperation.method) {
    case 'acknowledgeDistributions':
      acknowledgeDistributions(args[0].distributionOperation, cb)
      break    
    default:
      cb(null, { status: 'ERROR', message: 'Method Not Found.' })
      break
  }
}

function acknowledgeDistributions(args, cb) {
  var idList = args.testOrderReportDistributionIds;
  if (!idList) {
    console.log(`An array of testOrderReportDistributionIds was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `An array of testOrderReportDistributionIds was not provided as an argument.` });
  }

  var sqlStatements = [];
  idList.forEach(element => {
    var sqlStatement = `Update tblTestOrderReportDistribution set distributed = 1 where testOrderReportDistributionid = '${element}';`  
    sqlStatements.push(sqlStatement);
  });

  var sql = sqlStatements.join(' ');   
  db.executeSqlCommand(sql, function (error, result) {
    if (error) return cb(null, error);
    cb(null, result);
  })
}

distributionOperation.acknowledgeDistributions;
distributionOperation.processDistributionOperation = processDistributionOperation;
module.exports = distributionOperation;