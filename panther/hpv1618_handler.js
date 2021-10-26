const moment = require('moment');
const db = require('../database_operation.js');

const hpv1618Handler = {}

var hpv16InstrumentResultName = 'HPV 16 Result';
var hpv18InstrumentResultName = 'HPV 18/45 Result';

var resultMapping = [
  { instrumentResult: 'Negative', result: 'Negative', code: 'HPV1618G16NGTV', okToFinal: true },
  { instrumentResult: 'POSITIVE', result: 'Positive', code: 'HPV1618G16PSTV', okToFinal: false },
  { instrumentResult: 'Invalid', result: 'Invalid', code: 'HPV1618G16NVLD', okToFinal: false }
];

function handleResult(args, cb) {
  var hpv16InstrumentResult = args.testResults.find((r) => r.resultName == hpv16InstrumentResultName);
  var hpv18InstrumentResult = args.testResults.find((r) => r.resultName == hpv18InstrumentResultName);
  
  var mappedHPV16Result = resultMapping.find((r) => r.instrumentResult == hpv16InstrumentResult.resultValue);
  var mappedHPV18Result = resultMapping.find((r) => r.instrumentResult == hpv18InstrumentResult.resultValue);

  var instrumentResults = [mappedHPV16Result, mappedHPV18Result];

  var sql = `Update tblPanelSetOrderHPV1618 hpv Inner Join tblPanelSetOrder pso on hpv.ReportNo = pso.ReportNo Set HPV16Result = '${mappedHPV16Result.result}', `
    + `HPV16ResultCode = '${mappedHPV16Result.code}', `
    + `HPV18Result = '${mappedHPV18Result.result}', `
    + `HPV18ResultCode = '${mappedHPV18Result.code}' `
    + `Where pso.ReportNo = '${args.reportNo}' and pso.Accepted = 0; `;

  sql += `Update tblPanelSetOrder set `    
    + `Accepted = 1, `
    + `AcceptedBy = 'AUTOVER TESTING', `
    + `AcceptedById = 5134, `
    + `AcceptedDate = '${moment().format("YYYY-MM-DD")}', `
    + `AcceptedTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;
  
  if (mappedHPV16Result.okToFinal == true && mappedHPV18Result.okToFinal == true) {
    sql += `, Final = 1, `
      + `Signature = 'AUTOVER TESTING', `
      + `FinaledById = 5134, `
      + `FinalDate = '${moment().format("YYYY-MM-DD")}', `
      + `FinalTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;
  }
  
  sql +=  `where Accepted = 0 and ReportNo = '${args.reportNo}';`;  

  db.executeSqlCommand(sql, function (error, result) {
    if (error) return cb(null, error);
    cb(null, { status: 'OK', message: sql });
  });
}

hpv1618Handler.handleResult = handleResult;
module.exports = hpv1618Handler;
