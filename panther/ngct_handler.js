const moment = require('moment');
const db = require('../database_operation.js');

const ngctHandler = {}

var ngInstrumentResultName = 'GCResult';
var ctInstrumentResultName = 'CTResult';

var resultMappingCT = [
  { instrumentResult: 'CT neg', result: 'Negative', code: 'GCNGTV', okToFinal: true },
  { instrumentResult: 'CT POS', result: 'Positive', code: 'GCPSTV', okToFinal: false },
  { instrumentResult: 'Invalid', result: 'Invalid', code: 'GCNVLD', okToFinal: false }
];

var resultMappingNG = [
  { instrumentResult: 'GC neg', result: 'Negative', code: 'NGNGTV', okToFinal: true },
  { instrumentResult: 'GC POS', result: 'Positive', code: 'NGPSTV', okToFinal: false },
  { instrumentResult: 'Invalid', result: 'Invalid', code: 'NGNVLD', okToFinal: false }
];

function handleResult(args, cb) {

  var ctInstrumentResult = args.testResults.find((r) => r.resultName == ctInstrumentResultName);
  var ngInstrumentResult = args.testResults.find((r) => r.resultName == ngInstrumentResultName);
  
  var mappedCTResult = resultMappingCT.find((r) => r.instrumentResult == ctInstrumentResult.resultValue);
  var mappedNGResult = resultMappingNG.find((r) => r.instrumentResult == ngInstrumentResult.resultValue);

  if (mappedCTResult && mappedNGResult) {
    var instrumentResults = [mappedCTResult, mappedNGResult];

    var sql = `Update tblNGCTTestOrder ngct Inner Join tblPanelSetOrder pso on ngct.ReportNo = pso.ReportNo Set NeisseriaGonorrhoeaeResult = '${mappedNGResult.result}', `
      + `NGResultCode = '${mappedNGResult.code}', `
      + `ChlamydiaTrachomatisResult = '${mappedCTResult.result}', `
      + `CTResultCode = '${mappedCTResult.code}' `
      + `Where pso.ReportNo = '${args.reportNo}' and pso.Accepted = 0; `;

    sql += `Update tblPanelSetOrder set `
      + `Accepted = 1, `
      + `AcceptedBy = 'AUTOVER TESTING', `
      + `AcceptedById = 5134, `
      + `AcceptedDate = '${moment().format("YYYY-MM-DD")}', `
      + `AcceptedTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;

    if (mappedNGResult.okToFinal == true && mappedCTResult.okToFinal == true) {
      sql += `, Final = 1, `
        + `Signature = 'AUTOVER TESTING', `
        + `FinaledById = 5134, `
        + `FinalDate = '${moment().format("YYYY-MM-DD")}', `
        + `FinalTime = '${moment().format("YYYY-MM-DD HH:mm")}' `;
    }

    sql += `where Accepted = 0 and ReportNo = '${args.reportNo}';`;

    db.executeSqlCommand(sql, function (error, result) {
      if (error) return cb(null, error);
      cb(null, { status: 'OK', message: sql });
    });
  } else {
    cb(null, { status: 'ERROR', message: `Result Not Found or Mapped.` });
  }  
}

ngctHandler.handleResult = handleResult;
module.exports = ngctHandler;
