const moment = require('moment');
const db = require('../database_operation.js');
const textMessage = require('./test_message');

const sarscov2Handler = {}

var instrumentResultName = 'CoVResult';

var resultMapping = [
  { instrumentResult: 'Invalid', result: 'Invalid', code: 'SARSCOV2NVLD', comment: 'The result of this test was invalid. Please submit a new specimen for further testing.', okToFinal: false },
  { instrumentResult: 'Negative', result: 'Negative', code: 'SARSCOV2NGTV', okToFinal: true },  
  { instrumentResult: 'POSITIVE', result: 'POSITIVE', code: 'SARSCOV2PSTV', okToFinal: true }
];

function handleResult(args, cb) {  
  var instrumentResult = args.testResults.find((r) => r.resultName == instrumentResultName);    
  var mappedResult = resultMapping.find((r) => r.instrumentResult == instrumentResult.resultValue);

  var sql = `Update tblAPTIMASARSCoV2TestOrder r Inner Join tblPanelSetOrder pso on r.ReportNo = pso.ReportNo Set Result = '${mappedResult.result}', `
    + `ResultCode = '${mappedResult.code}' `;

  if (mappedResult.result == 'Invalid') {
    sql += `, Comment = '${mappedResult.comment}' `;
  }

  sql += `Where pso.ReportNo = '${args.reportNo}' and pso.Accepted = 0; `;

  sql += `Update tblPanelSetOrder set `    
    + `Accepted = 1, `
    + `AcceptedBy = 'AUTOVER TESTING', `
    + `AcceptedById = 5134, `
    + `AcceptedDate = '${moment().format("YYYY-MM-DD")}', `
    + `AcceptedTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;
    
  if (mappedResult.okToFinal == true) {
    sql += `, Final = 1, `
    + `Signature = 'AUTOVER TESTING', `
    + `FinaledById = 5134, `
    + `FinalDate = '${moment().format("YYYY-MM-DD")}', `
    + `FinalTime = '${moment().format("YYYY-MM-DD HH:mm")}' `
  }
    
  sql += `where Accepted = 0 and reportNo = '${args.reportNo}';`;
  sql += `Select clientId from tblAccessionOrder ao join tblPanelSetOrder pso on ao.MasterAccessionNo = pso.MasterAccessionNo where pso.ReportNo = '${args.reportNo}';`

  db.executeSqlCommand(sql, function (error, result) {
    if (error) {
      console.errror(error);
      return cb(null, error);
    }
    if (mappedResult.code == 'SARSCOV2PSTV') {
      console.log(result);
      //textMessage.send({ phone: '4065462446', message: 'YPI ALERT: A Positve COVID result for your organization has been released.' })
      cb(null, { status: 'OK', message: sql });
    } else {
      cb(null, { status: 'OK', message: sql });
    }    
  });
}

sarscov2Handler.handleResult = handleResult;
module.exports = sarscov2Handler;
