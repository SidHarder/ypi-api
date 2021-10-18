var db = require('./database_operation.js');
var mapping = require('./mapping');

var accessionOrder = {}

function getByMasterAccessionNo (args, cb) {
  var masterAccessionNo = args.masterAccessionNo;
  if (!masterAccessionNo) {
    return cb(null, { status: 'ERROR', message: `The masterAccessionNo was not provided as an argument` });
  }

  var sql = `select * from tblAccessionOrder where masterAccessionNo = '${masterAccessionNo}';`;
  db.executeSqlCommand(sql, function (error, result) {
    if (error) {
      console.error(error);
      return cb(null, error)      
    }
    
  });
}

accessionOrder.getByMasterAccessionNo = this.getByMasterAccessionNo;
module.exports = accessionOrder;