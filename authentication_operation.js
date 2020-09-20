const qrcode = require('qrcode')
const speakeasy = require('speakeasy')
const jwt = require('jsonwebtoken')

const db = require('./database_operation.js')
const authenticationOperation = {}

function processAuthenticationOperation(args, cb) {
  if (args[0].authenticationRequest.method == 'getQRCode') {
    getQRCode(args, cb)
  } else if (args[0].authenticationRequest.method == 'getToken') {
    getToken(args, cb)
  } else {
    cb(null, { status: 'ERROR', message: `${args[0].authenticationRequest.method} is Not implemented.` })
  }
}

function getToken(args, cb) {
  var userName = args[0].authenticationRequest.userName
  var password = args[0].authenticationRequest.password
  var authenticatorToken = args[0].authenticationRequest.authenticatorToken

  IsUsernamePasswordValid(userName, password, function (error, isValid, webServiceAccount) {
    console.log(webServiceAccount)
    if (isValid == true) {
      var verified = speakeasy.totp.verify({ secret: webServiceAccount.TwoFactorSecret, encoding: 'base32', token: authenticatorToken })
      if (verified) {
        var user = {
          displayName: webServiceAccount.DisplayName,
          enableReportBrowser: webServiceAccount.EnableReportBrowser
        }
        var token = jwt.sign(user, webServiceAccount.TwoFactorSecret)
        cb(null, { status: 'OK', isAuthenticated: true, token: token })
      } else {
        cb(null, { status: 'OK', isAuthenticated: false, message: 'The Authenticator Id is not valid.' })
      }
    } else {
      cb(null, { status: 'OK', isAuthenticated: false, message: 'Username or password is invalid.' })
    }
  })
}

function getQRCode(args, cb) {
  var userName = args[0].authenticationRequest.userName
  var password = args[0].authenticationRequest.password

  IsUsernamePasswordValid(userName, password, function (error, isValid, webServiceAccount) {
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
  getWebServiceAccountByUsernamePassword(userName, password, function (error, queryResult, webServiceAccount) {
    if (error) return cb(error)
    if (queryResult.length == 0) {
      cb(null, false)
    } else {
      cb(null, true, queryResult[0])
    }
  })
}

function getWebServiceAccountByUsernamePassword(userName, password, cb) {
  let commandText = `select * from tblWebServiceAccount where UserName = '${userName}' and Password = '${password}'`
  console.log(commandText)
  db.executeSqlCommand(commandText, function (error, result) {
    if (error) return cb(error)
    return cb(null, result.queryResult)
  })
}

function authenticate(args, cb) {
  var token = jwt.sign(payload, 'thepasswordsecretisthisstatement')
  cb(null, { status: 'OK', token: token, message: 'Here is your token.' })
}

function validateToken() {}

authenticationOperation.processAuthenticationOperation = processAuthenticationOperation
module.exports = authenticationOperation

/*
var secret = speakeasy.generateSecret({
    name: 'YPI Connect'
})


qrcode.toDataURL(secret.otpauth_url, function (error, data)
{
    console.log(data)
})
*/

//secret
//'n!v%,,}PB1d)8*Kh[t1Hy:{l,qPaHVA8

//qrcode
//data:image/png;base64,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
