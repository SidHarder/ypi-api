var moment = require('moment');
var db = require('./database_operation.js');

var systemUserHandler = {}

var systemUserMethods = [];
systemUserMethods.push({ methodName: 'getSystemUsers', methodHandler: getSystemUsers });

function methodHandler(args, cb) {
  var methodName = args.method;
  if (!methodName) {
    return cb(null, { status: 'ERROR', message: `The method name was not provided as an argument` });
  }
  var method = systemUserMethods.find((m) => m.methodName == methodName);
  if (!method) {
    return cb(null, { status: 'ERROR', messge: 'The method name was not found.' });
  }
  method.methodHandler(args, cb);
}

function getSystemUsers(args, cb) {
  var sql = `select UserId as userId, UserName as userName from tblSystemUser;`;  
  db.executeSqlCommand(sql, function (error, queryResult) { 
    console.log(sql);
    cb(null, { status: 'OK', systemUsers: queryResult.results });
  })  
}

systemUserHandler.methodHandler = methodHandler;
systemUserHandler.getSystemUsers = getSystemUsers;
module.exports = systemUserHandler;