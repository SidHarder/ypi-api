var moment = require('moment');

var db = require('./database_operation.js');
var mapping = require('./mapping');
var accessionOrderMapping = require('./sql_map_files/accession_order.json')
var specimenOrderMapping = require('./sql_map_files/specimen_order.json')
var panelSetOrderMapping = require('./sql_map_files/panel_set_order.json')
var aptimaSarsCov2TestOrderMapping = require('./sql_map_files/aptima_sarscov2_test_order.json');
const { EventContext } = require('twilio/lib/rest/monitor/v1/event');

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
  sql += `select * from tblSpecimenOrder where masterAccessionNo = '${masterAccessionNo}';`;
  sql += `select * from tblPanelSetOrder where masterAccessionNo = '${masterAccessionNo}';`;
  sql += `select result.* from tblAPTIMASARSCoV2TestOrder result join tblPanelSetOrder pso on result.ReportNo = pso.ReportNo where pso.MasterAccessionNo = '${masterAccessionNo}';`;

  db.executeSqlCommand(sql, function (error, queryResult) {        
    var accessionOrder = mapping.toCamelCase(accessionOrderMapping, queryResult.results[0][0]);

    accessionOrder.specimenOrders = [];
    var specimenOrdersSql = queryResult.results[1];
    specimenOrdersSql.forEach(specimenOrderSql => {
      var specimenOrder = mapping.toCamelCase(specimenOrderMapping, specimenOrderSql);
      accessionOrder.specimenOrders.push(specimenOrder);
    });

    accessionOrder.panelSetOrders = [];
    var panelSetOrdersSql = queryResult.results[2];
    panelSetOrdersSql.forEach(panelSetOrderSql => {
      var panelSetOrder = mapping.toCamelCase(panelSetOrderMapping, panelSetOrderSql);
      panelSetOrder.aptimaSarscov2Result = mapping.toCamelCase(aptimaSarsCov2TestOrderMapping, queryResult.results[3][0]);
      accessionOrder.panelSetOrders.push(panelSetOrder);
    });

    cb(null, { status: 'OK', accessionOrder });
  });    
}

accessionOrderHandler.methodHandler = methodHandler;
accessionOrderHandler.getByMasterAccessionNo = getByMasterAccessionNo;
module.exports = accessionOrderHandler;