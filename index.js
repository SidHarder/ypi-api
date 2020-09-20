const jayson = require('jayson')

const authenticationOperation = require('./authentication_operation')
const databaseOperation = require('./database_operation')
const caseDocumentOperation = require('./case_document_operation')

const port = 3000

const server = jayson.server({
  ping: ping,
  authenticationOperation: authenticationOperation.processAuthenticationOperation,
  databaseOperation: databaseOperation.processDatabaseOperation,
  caseDocumentOperation: caseDocumentOperation.processCaseDocumentOperation
})

function ping(args, cb) {
  console.log('Ping received .. sending pong response.')
  cb(null, { status: 'OK', message: 'Pong' })
}

server.http().listen(port, function () {
  console.log('Server is listening on port: ' + port)
})
