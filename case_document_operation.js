var fs = require('fs')

var caseDocumentOperation = {}

function processCaseDocumentOperation(args, cb) {
  if (args[0].caseDocumentOperation.method == 'getCaseDocument') {
    getCaseDocument(args, cb)
  } else {
    cb(null, { status: 'ERROR', message: `${args[0].caseDocumentOperation.method} is Not implemented.` })
  }
}

function getCaseDocument(args, cb) {
  var fileName = args[0].caseDocumentOperation.fileName
  fs.readFile(fileName, function (error, data) {
    if (error) return cb(null, { status: 'ERROR', message: error })
    cb(null, { status: 'OK', message: data })
  })
}

caseDocumentOperation.processCaseDocumentOperation = processCaseDocumentOperation
module.exports = caseDocumentOperation
