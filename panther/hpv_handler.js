const moment = require('moment');
const db = require('../database_operation.js');

const hpvHandler = {}

var instrumentResultName = 'OverallInterpretation';

var resultMapping = [
  { instrumentResult: 'Negative', result: 'Negative', code: 'HPVNGTV', okToFinal: true },
  { instrumentResult: 'POSITIVE', result: 'Positive', code: 'HPVPSTV', okToFinal: false },
  { instrumentResult: 'Invalid', result: 'Invalid', code: 'HPVNVLD', okToFinal: false }
];

function handleResult(args, cb) {

  var instrumentResult = args.testResults.find((r) => r.resultName == instrumentResultName);  
  var mappedResult = resultMapping.find((r) => r.instrumentResult == instrumentResult.resultValue);

  var sql = `Update tblHPVTestOrder hpv Inner Join tblPanelSetOrder pso on hpv.ReportNo = pso.ReportNo Set Result = '${mappedResult.result}', `
    + `ResultCode = '${mappedResult.code}' `
    + `Where pso.reportNo = '${args.reportNo}' and pso.Accepted = 0; `;

  sql += `Update tblPanelSetOrder set `    
    + `Accepted = 1, `
    + `AcceptedBy = 'AUTOVER TESTING', `
    + `AcceptedById = 5134, `
    + `AcceptedDate = '${moment().format("YYYY-MM-DD")}', `
    + `AcceptedTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;
  
  if(mappedResult.okToFinal == true) {
    sql += `, Final = 1, `
      + `Signature = 'AUTOVER TESTING', `
      + `FinaledById = 5134, `
      + `FinalDate = '${moment().format("YYYY-MM-DD")}', `
      + `FinalTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;
  }
  
  sql +=  `where Accepted = 0 and reportNo = '${args.reportNo}';`;  

  db.executeSqlCommand(sql, function (error, result) {
    if (error) {
      console.log(error);
      return cb(null, error);
    }
    cb(null, { status: 'OK', message: sql });
  });
}

hpvHandler.handleResult = handleResult;
module.exports = hpvHandler;
