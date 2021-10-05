const moment = require('moment');
const db = require('../database_operation.js');

const sarscov2Handler = {}

var instrumentResultName = 'CoVResult';

var resultMapping = [
    { result: 'Negative', code: 'SARSCOV2NGTV' },
    { result: 'POSITIVE', code: 'SARSCOV2PSTV' }
  ];

function handleResult(args, cb) {
  var instrumentResult = args.testResults.find((r) => r.resultName == instrumentResultName);  
  var mappedResult = resultMapping.find((r) => r.result == instrumentResult.resultValue);    

  var sql = `Update tblAPTIMASARSCoV2TestOrder r Inner Join tblPanelSetOrder pso on r.ReportNo = pso.ReportNo Set Result = '${mappedResult.result}', `
    + `ResultCode = '${mappedResult.code}' `    
    + `Where pso.OrderedOnId = '${args.aliquotOrderId}' and pso.Accepted = 0; `;

  sql += `Update tblPanelSetOrder set `
    + `Accepted = 1, `
    + `AcceptedBy = 'AUTOVER TESTING', `
    + `AcceptedById = 5134, `
    + `AcceptedDate = '${moment().format("YYYY-MM-DD")}', `
    + `AcceptedTime = '${moment().format("YYYY-MM-DD HH:mm")}', `  
    + `Final = 1, `
    + `Signature = 'AUTOVER TESTING', `
    + `FinaledById = 5134, `
    + `FinalDate = '${moment().format("YYYY-MM-DD")}', `
    + `FinalTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;  
  
  sql +=  `where PanelSetId = 415 and Accepted = 0 and OrderedOnId = '${args.aliquotOrderId}';`;  

  db.executeSqlCommand(sql, function (error, result) {
    if (error) return cb(null, error);
    cb(null, { status: 'OK', message: `The Instrument result for ${args.aliquotOrderId}` });
  });
}

sarscov2Handler.handleResult = handleResult;
module.exports = sarscov2Handler;
