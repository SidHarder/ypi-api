var moment = require('moment');

var db = require('./database_operation.js');
var mapping = require('./mapping');

var accessionOrderHandler = {}

var accessionOrderMethods = [];
accessionOrderMethods.push({ methodName: 'getByMasterAccessionNo', methodHandler: getByMasterAccessionNo });

function methodHandler (args, cb) {
  var methodName = args.method;
  if (!methodName) {
    return cb(null, { status: 'ERROR', message: `The method name was not provided as an argument` });
  }
  var method = accessionOrderMethods.find((m) => m.methodName == methodName);
  if(!method) {
    return cb(null, { status: 'ERROR', messge: 'The method name was not found.' });
  }
  method.methodHandler(args, cb);
}

function getByMasterAccessionNo (args, cb) {
  var masterAccessionNo = args.masterAccessionNo;
  if (!masterAccessionNo) {
    return cb(null, { status: 'ERROR', message: `The masterAccessionNo was not provided as an argument` });
  }

  var sql = `select * from tblAccessionOrder where masterAccessionNo = '${masterAccessionNo}';`;
  sql += `select * from tblPanelSetOrder where masterAccessionNo = '${masterAccessionNo}';`;

  db.executeSqlCommand(sql, function (error, queryResult) {
    //if (error) {
    //  console.error(err
      //return cb(null, error)      
    //}

    mapping.getMapping('tblAccessionOrder', function (error, tableMapping) {
      var aoCamelCase = mapping.toCamelCase(tableMapping, queryResult.results[0]);      
      cb(null, { status: 'OK', accessionOrder: aoCamelCase });
    });
  });
}

accessionOrderHandler.methodHandler = methodHandler;
accessionOrderHandler.getByMasterAccessionNo = getByMasterAccessionNo;
module.exports = accessionOrderHandler;