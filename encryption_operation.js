const db = require('./database_operation.js')
const crypto = require('crypto')
const moment = require('moment')
const algorithm = 'aes-192-cbc'

const encryptionOperation = {}

function createResultUrl (args, cb) {
  var reportNo = args[0].reportNo;
  if (!reportNo) {
    console.log(`A reportNo was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A reportNo was not provided as an argument.` });
  }

  var encryptedReportNo = encrypt(process.env.SYSTEM_KEY, process.env.SYSTEM_IV, reportNo)   
  return cb(null, { status: 'OK', url: `https://connect.ypii.com/test/covid/result?id=${encryptedReportNo}` });
}

function createResultPackage (args, cb) {
  console.log(`Running createResultPackage`)

  var data = args[0].data;
  if (!data) {
    console.log(`Data was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `Data was not provided as an argument.` });
  }

  console.log(`The data provided: ${data}`)
  var decryptionResult = decrypt(process.env.SYSTEM_KEY, process.env.SYSTEM_IV, data);  
  var reportNo = decryptionResult.decryptedResult;
  getResultInfo(reportNo, function (error, resultInfo) {    
    var resultPackage = {
      reportNo: resultInfo.reportNo,
      encryptedReportNo: data,
      lastName: resultInfo.lastName,
      firstName: resultInfo.firstName,
      collectionDate: moment(resultInfo.collectionDate).format('MM/DD/YYYY'),
      encryptedResult: encryptResult(resultInfo.dateOfBirth, resultInfo.result)
    }    
    return cb(null, { status: 'OK', resultPackage });
  });  
}

function decryptData(args, cb) {
  console.log(`Running decryptUrl`)

  var data = args[0].data;
  if (!data) {
    console.log(`Data was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `Data was not provided as an argument.` });
  }

  console.log(`The data provided: ${data}`)
  var decryptionResult = decrypt(process.env.SYSTEM_KEY, process.env.SYSTEM_IV, data);
  console.log(decryptionResult)
  return cb(null, decryptionResult);
}

function encryptResult (dateOfBirth, testResult) {
  var cryptkeyDOB = crypto.scryptSync(dateOfBirth, 'salt', 24)  
  let iv = crypto.randomBytes(16)  
  let encTestResult = encrypt(cryptkeyDOB, iv, testResult)

  var result = { iv: iv.toString('hex'), data: encTestResult }
  return result
}

function getResultInfo(reportNo, cb) {
  let sql = `select pso.ReportNo, ao.PFirstName, ao.PLastName, date_format(PBirthdate, '%Y%m%d') PBirthdate, date_format(ao.CollectionDate, '%Y%m%d') CollectionDate, sars.Result `;
	sql += `from tblAccessionOrder ao `;
  sql += `join tblPanelSetOrder pso on ao.MasterAccessionNo = pso.MasterAccessionNo `;
  sql += `join tblSARSCoV2TestOrder sars on pso.ReportNo = sars.ReportNo `;
  sql += `where pso.reportNo = '${reportNo}';`;

  db.executeSqlCommand(sql, function (error, result) {
    if (error) return cb(null, error)
    if (result.queryResult.length > 0) {      
      let resultInfo = {
        reportNo: reportNo,
        lastName: result.queryResult[0].PLastName,
        firstName: result.queryResult[0].PFirstName,
        dateOfBirth: result.queryResult[0].PBirthdate,
        collectionDate: result.queryResult[0].CollectionDate,
        result: result.queryResult[0].Result
      }      
      cb(null, resultInfo)
    } else {
      cb(`ReportNo not found: ${reportNo}`);
    }
  })
}

function decryptResult (args, cb) {
  console.log(`Running decryptResult`)

  var iv = args[0].iv;
  if (!iv) {
    console.log(`IV was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `IV was not provided as an argument.` });
  }

  var dateOfBirth = args[0].dateOfBirth;
  if (!dateOfBirth) {
    console.log(`dateOfBirth was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `dateOfBirth was not provided as an argument.` });
  }

  var data = args[0].data;
  if (!data) {
    console.log(`data was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `data was not provided as an argument.` });
  }

  var dobBuf = crypto.scryptSync(dateOfBirth, 'salt', 24)
  var ivBuf = Buffer.from(iv, 'hex')  
  
  var result = decrypt(dobBuf, ivBuf, data)  
  if (result.status == 'ERROR') result.message = 'We are not able to access your SARS-CoV-2 result because the date of birth provided does not match our records.';
  return cb(null, result);
}

function decrypt(cryptkey, iv, encryptdata) {
  try {
    var decipher = crypto.createDecipheriv(algorithm, cryptkey, iv)
    let decrypted = decipher.update(encryptdata, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return { status: 'OK', decryptedResult: decrypted, keyIsCorrect: true }
  } catch (ex) {
    console.log(ex)
    return { status: 'ERROR', keyIsCorrect: false }
  }  
}

function encrypt(cryptkey, iv, cleardata) {
  var encipher = crypto.createCipheriv(algorithm, cryptkey, iv)
  let encrypted = encipher.update(cleardata, 'utf8', 'hex')
  encrypted += encipher.final('hex')
  return encrypted
}

encryptionOperation.decryptResult = decryptResult
encryptionOperation.createResultUrl = createResultUrl
encryptionOperation.createResultPackage = createResultPackage
encryptionOperation.decryptData = decryptData
module.exports = encryptionOperation