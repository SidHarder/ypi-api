const qrcode = require('qrcode')
const speakeasy = require('speakeasy')
const jwt = require('jsonwebtoken')

const db = require('./database_operation.js')
const authenticationOperation = {}

function processAuthenticationOperation(args, cb) {
  if (args[0].authenticationOperation.method == 'getQRCode') {
    getQRCode(args, cb)
  } else if (args[0].authenticationOperation.method == 'getToken') {
    getToken(args, cb)
  } else {
    cb(null, { status: 'ERROR', message: `${args[0].authenticationOperation.method} is Not implemented.` })
  }
}

function getToken(args, cb) {
  var userName = args[0].authenticationOperation.userName
  var password = args[0].authenticationOperation.password
  var authenticatorToken = args[0].authenticationOperation.authenticatorToken
  
  IsUsernamePasswordValid(userName, password, function (error, isValid, webServiceAccount, webServiceAccountClient, clientsAllowed) {
    console.log(webServiceAccount)
    if (isValid == true) {
      console.log(`--> The two factor sectet is: ${webServiceAccount.TwoFactorSecret}`)
      var verified = speakeasy.totp.verify({ secret: webServiceAccount.TwoFactorSecret, encoding: 'base32', token: authenticatorToken })
      if (verified) {
        var user = { displayName: webServiceAccount.DisplayName, enableReportBrowser: webServiceAccount.EnableReportBrowser }
        var token = jwt.sign(user, webServiceAccount.TwoFactorSecret)                
        cb(null, { status: 'OK', isAuthenticated: true, message: 'A token has been created for this user.', token: token, webServiceAccount: webServiceAccount, webServiceAccountClient: webServiceAccountClient, clientsAllowed: clientsAllowed })
      } else {
        cb(null, { status: 'OK', isAuthenticated: false, message: 'The Authenticator Id is not valid.' })
      }
    } else {
      cb(null, { status: 'OK', isAuthenticated: false, message: 'Username or password is invalid.' })
    }
  })
}

function getQRCode(args, cb) {
  var userName = args[0].authenticationOperation.userName
  var password = args[0].authenticationOperation.password

  IsUsernamePasswordValid(userName, password, function (error, isValid, webServiceAccount, webServiceAccountClient, clientsAllowed) {
    if (error) return cb(null, { status: 'ERROR', message: error })
    if (isValid) {
      var secret = speakeasy.generateSecret({ name: 'YPI Connect' })
      updateSecret(secret, webServiceAccount, function (error, result) {
        qrcode.toDataURL(secret.otpauth_url, function (error, data) {
          if (error) return cb({ status: 'ERROR', message: error })
          return cb(null, { status: 'OK', isAuthenticated: true, qrCodeImage: data })
        })
      })
    } else {
      return cb(null, { status: 'OK', isAuthenticated: false })
    }
  })
}

function updateSecret(secret, webServiceAccount, cb) {
  let commandText = `Update tblWebServiceAccount set TwoFactorSecret = '${secret.base32}' where WebServiceAccountId = '${webServiceAccount.WebServiceAccountId}'`
  console.log(commandText)
  db.executeSqlCommand(commandText, function (error, result) {
    if (error) return cb(error)
    return cb(null, result)
  })
}

function IsUsernamePasswordValid(userName, password, cb) {
  console.log(`Running: IsUsernamePasswordValid.`)
  getWebServiceAccountByUsernamePassword(userName, password, function (error, queryResult) {
    if (error) return cb(error)
    if (queryResult[0].length == 0) {
      console.log(`Failure: Search by Username and password did not succeed.`)
      cb(null, false)
    } else {
      console.log(`Success: Search by Username and password succeeded.`)
      cb(null, true, queryResult[0][0], queryResult[1], queryResult[2])
    }
  })
}

function getWebServiceAccountByUsernamePassword(userName, password, cb) {
  console.log(`--> Running getWebServiceAccountByUsernamePassword for: ${userName}`);
  let commandText = `select * from tblWebServiceAccount where UserName = '${userName}' and Password = '${password}';`; 
  commandText += `select wsac.* from tblWebServiceAccountClient wsac join tblWebServiceAccount wsa on wsac.WebServiceAccountId = wsa.WebServiceAccountId where wsa.UserName = '${userName}' and wsa.Password = '${password}';`
  commandText += `select * from tblClient where clientId in (select wsac.clientId from tblWebServiceAccountClient wsac join tblWebServiceAccount wsa on wsac.WebServiceAccountId = wsa.WebServiceAccountId where wsa.UserName = '${userName}' and wsa.Password = '${password}');`
  commandText += `select * from tblClientGroupClient where clientId = (select primaryClientId from tblWebServiceAccount where UserName = '${userName}' and Password = '${password}');`;
  
  db.executeSqlCommand(commandText, function (error, result) {
    if (error) return cb(error)
    console.log(result)
    return cb(null, result.queryResult)
  })
}

function authenticate(args, cb) {
  var token = jwt.sign(payload, 'thepasswordsecretisthisstatement')
  cb(null, { status: 'OK', token: token, message: 'Here is your token.' })
}

function validateToken() { }

authenticationOperation.processAuthenticationOperation = processAuthenticationOperation
module.exports = authenticationOperation