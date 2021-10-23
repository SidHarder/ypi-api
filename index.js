const dotenv = require('dotenv').config();
const jayson = require('jayson')

const authenticationOperation = require('./authentication_operation')
const databaseOperation = require('./database_operation')
const encryptionOperation = require('./encryption_operation')
const textMessage = require('./text_message')
const email = require('./email');
const covidResultDistribution = require('./covid_result_distribution');
const billingOperation = require('./billing_operation');
const distributionOperation = require('./distribution_operation');
const pantherOperation = require('./panther/panther_operation');
const caseDocumentOperation = require('./document/case_document_operation');
const domainOperation = require('./domain_operation');

const server = jayson.server({
  ping: ping,
  sendTextMessage: textMessage.send,
  sendEmail: email.send,
  authenticationOperation: authenticationOperation.processAuthenticationOperation,
  databaseOperation: databaseOperation.processDatabaseOperation,
  createResultUrl: encryptionOperation.createResultUrl,
  createResultPackage: encryptionOperation.createResultPackage,
  decryptResult: encryptionOperation.decryptResult,
  decryptData: encryptionOperation.decryptData,
  sendCovidResultText: covidResultDistribution.sendText,
  sendCovidResultEmail: covidResultDistribution.sendEmail,
  billingOperation: billingOperation.processBillingOperation,
  distributionOperation: distributionOperation.processDistributionOperation,
  pantherOperation: pantherOperation.processPantherOperation,
  caseDocumentOperation: caseDocumentOperation.processCaseDocumentOperation,
  domainOperation: domainOperation.processDomainOperation
});

function ping(args, cb) {
  console.log('Ping received .. sending pong response.');
  cb(null, { status: 'OK', message: 'Pong' });
}

server.http().listen(process.env.APP_PORT, function () {
  console.log(`Server is listening on port: ${process.env.APP_PORT}`);
})
