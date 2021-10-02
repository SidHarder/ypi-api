const moment = require('moment');

const hpv1618Handler = {}

function handleResult(args, cb) {
  
}

function handlePositiveResult(result) {
  var sql = $`Update tblPanelSetOrderHPV1618 hpv Inner Join tblPanelSetOrder pso on hpv.ReportNo = pso.ReportNo Set HPV16Result = '${result.hpv16Result}', `
    + `HPV16ResultCode = '${result.hpv16ResultCode}', `
    + `HPV18Result = '${result.hpv18Result}', `
    + `HPV18ResultCode = '${result.hpv18ResultCode}' `
    + `Where pso.OrderedOnId = '${result.aliquotOrderId}' and pso.Accepted = 0; `;

  sql += `Update tblPanelSetOrder set `
    + `Accepted = 1, `
    + `AcceptedBy = 'AUTOVER TESTING', `
    + `AcceptedById = 5134, `
    + `AcceptedDate = '${moment().format("yyyy-MM-dd")}', `
    + `AcceptedTime = '${moment().format("yyyy-MM-dd HH:mm")}', `
    + `Final = 1, `
    + `Signature = 'AUTOVER TESTING', `
    + `FinaledById = 5134, `
    + `FinalDate = '${moment().format("yyyy-MM-dd")}', `
    + `FinalTime = '${moment().format("yyyy-MM-dd HH:mm")}', `
    + `where PanelSetId = 62 and Accepted = 0 and OrderedOnId = '${result.aliquotOrderId}';`;
}

function handleNegativeResult(result) {

}

hpv1618Handler.handleResult = handleResult;
module.exports = hpv1618Handler;
