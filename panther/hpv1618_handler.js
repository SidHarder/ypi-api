const moment = require('moment');
const db = require('../database_operation.js');

const hpv1618Handler = {}

var hpv16InstrumentResultName = 'HPV 16 Result';
var hpv18InstrumentResultName = 'HPV 18/45 Result';

var resultMapping = [{ result: 'Negative', code: 'HPV1618G16NGTV' },
  { result: 'Positive', code: 'HPV1618G16PSTV' },
  { result: 'Invalid', code: 'HPV1618G16NVLD' }];

function handleResult(args, cb) {

  var hpv16InstrumentResult = args.testResults.find((r) => r.resultName == hpv16InstrumentResultName);
  var hpv18InstrumentResult = args.testResults.find((r) => r.resultName == hpv18InstrumentResultName);
  
  var mappedHPV16Result = resultMapping.find((r) => r.result == hpv16InstrumentResult.resultValue);
  var mappedHPV18Result = resultMapping.find((r) => r.result == hpv18InstrumentResult.resultValue);

  var instrumentResults = [mappedHPV16Result, mappedHPV18Result];

  var sql = `Update tblPanelSetOrderHPV1618 hpv Inner Join tblPanelSetOrder pso on hpv.ReportNo = pso.ReportNo Set HPV16Result = '${mappedHPV16Result.result}', `
    + `HPV16ResultCode = '${mappedHPV16Result.code}', `
    + `HPV18Result = '${mappedHPV18Result.result}', `
    + `HPV18ResultCode = '${mappedHPV18Result.code}' `
    + `Where pso.OrderedOnId = '${args.aliquotOrderId}' and pso.Accepted = 0; `;

  sql += `Update tblPanelSetOrder set `
    + `Accepted = 1, `
    + `AcceptedBy = 'AUTOVER TESTING', `
    + `AcceptedById = 5134, `
    + `AcceptedDate = '${moment().format("YYYY-MM-DD")}', `
    + `AcceptedTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;

  var positiveResult = instrumentResults.find((r) => r.result == 'Positive');
  if(positiveResult == undefined) {
    sql += `, Final = 1, `
      + `Signature = 'AUTOVER TESTING', `
      + `FinaledById = 5134, `
      + `FinalDate = '${moment().format("YYYY-MM-DD")}', `
      + `FinalTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;
  }
  
  sql +=  `where PanelSetId = 62 and Accepted = 0 and OrderedOnId = '${args.aliquotOrderId}';`;  

  db.executeSqlCommand(sql, function (error, result) {
    if (error) return cb(null, error);
    cb(null, { status: 'OK', message: `The Instrument result for ${args.aliquotOrderId}` });
  });
}

hpv1618Handler.handleResult = handleResult;
module.exports = hpv1618Handler;
