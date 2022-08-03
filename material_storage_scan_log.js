var mapping = require('./mapping');
var materialStorageScanLogMapping = require('./sql_map_files/material_storage_scan_log.json');
var db = require('./database_operation');

var materialStorageScanLog = {}

var materialStorageScanLogMethods = [];
materialStorageScanLogMethods.push({ methodName: 'insertScan', methodHandler: insertScan });
materialStorageScanLogMethods.push({ methodName: 'getScans', methodHandler: getScans });

function methodHandler(args, cb) {
  var methodName = args.method;
  if (!methodName) {
    return cb(null, { status: 'ERROR', message: `The method name was not provided as an argument` });
  }
  var method = materialStorageScanLogMethods.find((m) => m.methodName == methodName);
  if (!method) {
    return cb(null, { status: 'ERROR', messge: 'The method name was not found.' });
  }
  method.methodHandler(args, cb);
}

function insertScan(args, cb) {  
  var sqlStatements = [];
  mapping.pushSqlStatement(materialStorageScanLogMapping, 'tblMaterialStorageScanLog',args.materialStorageScanLog, sqlStatements);  
  console.log(sqlStatements);
  db.executeSqlCommand(sqlStatements[0], function (error, result) {    
    if (error) {
      console.log(error);
      cb(null, { status: 'ERROR', error });
    } 
    cb(null, { status: 'OK' });
  })  
}

function getScans(args, cb) {
  cb(null, { status: 'OK' });
}

materialStorageScanLog.methodHandler = methodHandler;
module.exports = materialStorageScanLog;