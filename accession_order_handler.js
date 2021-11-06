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
    mapping.getMapping('tblAccessionOrder', function (error, aoMapping) {
      var accessionOrder = mapping.toCamelCase(aoMapping, queryResult.results[0][0]);
      accessionOrder.panelSetOrders = [];
      var psoSql = queryResult.results[1];
      mapping.getMapping('tblPanelSetOrder', function (error, psoMapping) {
        psoSql.forEach(pso => {
          var pso = mapping.toCamelCase(psoMapping, pso);
          accessionOrder.panelSetOrders.push(pso);
        });
        cb(null, { status: 'OK', accessionOrder });
      });
    });
  });
}

accessionOrderHandler.methodHandler = methodHandler;
accessionOrderHandler.getByMasterAccessionNo = getByMasterAccessionNo;
module.exports = accessionOrderHandler;