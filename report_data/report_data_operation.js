const moment = require('moment');
const db = require('../database_operation.js')

const reportDataOperation = {};

const reportDataHandlerMapp = [
  { target: 'covidReports', method: 'getClientCovidCases', mappedMethod: getClientCovidCases }  
];

function processReportDataOperation(args, cb) {
  var map = reportDataHandlerMapp.find((r) => r.target == args[0].reportDataOperation.target && r.method == args[0].reportDataOperation.method);  
  if (map) {
    map.mappedMethod(args[0].reportDataOperation, cb);
  } else {
    console.error('reportDataOperation.processReportDataOperation: Target/Method Not Found')
    cb(null, { status: 'ERROR', message: `Target/Method Not Found` });
  }
}

function getClientCovidCases (args, cb) {
  var clientId = args.clientId;
  if (!clientId) {
    console.log(`A clientId was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A clientId was not provided as an argument.` });
  }

  var startDate = args.startDate;
  if (!startDate) {
    console.log(`A startDate was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A startDate was not provided as an argument.` });
  }

  var endDate = args.endDate;
  if (!endDate) {
    console.log(`An endDate was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `An endDate was not provided as an argument.` });
  }

  var sql = `select ao.AccessionDate, pso.FinalDate, ao.PFirstName \`FirstName\`, ao.PLastName \`LastName\`, cov.Result, ao.ClientName, ao.PhysicianName ` +
    `from tblAccessionOrder ao ` +
    `join tblPanelSetOrder pso on ao.MasterAccessionNo = pso.MasterAccessionNo ` +
    `join tblAPTIMASARSCoV2TestOrder cov on pso.ReportNo = cov.reportNo ` +
    `where pso.Finaldate between '${startDate}' and '${endDate}' and ao.ClientId = ${clientId};`

  db.executeSqlCommand(sql, function (error, result) {
    if (error) {
      console.error(error);
      return cb(null, { status: 'ERROR', error });
    }
    
    cb(null, { status: 'OK', results: result.results });
  })  
}

reportDataOperation.processReportDataOperation = processReportDataOperation;
reportDataOperation.getClientCovidCases = getClientCovidCases;
module.exports = reportDataOperation;