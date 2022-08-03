var db = require('./database_operation.js');
var accessionOrderHandler = require('./accession_order_handler');
var materialStorageScanLog = require('./material_storage_scan_log');

var domainOperation = {};

var domainTargets = [
  { targetName: 'accessionOrder', targetHandler: accessionOrderHandler.methodHandler },
  { targetName: 'materialStorageScanLog', targetHandler: materialStorageScanLog.methodHandler }
]

function processDomainOperation(args, cb) {
  var targetName = args[0].domainOperation.target;
  if (!targetName) {
    return cb(null, { status: 'ERROR', message: `The target name was not provided as an argument` });
  }
  var domainTarget = domainTargets.find((t) => t.targetName == targetName);
  if(!domainTarget) {
    return cb(null, { status: 'ERROR', message: 'The domain target was not found.' })
  }
  domainTarget.targetHandler(args[0].domainOperation, cb);
}

domainOperation.processDomainOperation = processDomainOperation;
module.exports = domainOperation;