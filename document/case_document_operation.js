const db = require('../database_operation.js');
var fs = require('fs');
const PDFDocument = require('pdfkit');

var caseDocumentHeader = require('./case_document_header');
const accessionOrderHandler = require('../accession_order_handler.js');
const caseDocumentOperation = {}

var operationMap = [
  { method: 'getCaseDocument', mappedMethod: getCaseDocument },
  { method: 'createCaseDocument', mappedMethod: createCaseDocument }
]

function processCaseDocumentOperation(args, cb) {
  var operationMethod = operationMap.find((r) => r.method == args[0].caseDocumentOperation.method);
  if (operationMethod) {
    operationMethod.mappedMethod(args[0].caseDocumentOperation, cb);
  } else {
    cb(null, { status: 'ERROR', message: `Method Not Found` });
  }
}

function getCaseDocument(args, cb) {
  var fileName = args.fileName
  fs.readFile(fileName, function (error, data) {
    if (error) {
      console.error(error);
      return cb(null, { status: 'ERROR', message: error })
    }
    cb(null, { status: 'OK', message: data })
  })
}

function createCaseDocument (args, cb) {    
  accessionOrderHandler.getByMasterAccessionNo(args, function (error, result) {
    if (error) {
      return cb(null, error)
    }

    var margins = { margins: { top: 5, bottom: 5, left: 5, right: 5 } }
    var doc = new PDFDocument(margins);
    doc.pipe(fs.createWriteStream('/home/sharder/pdf_files/output.pdf'));
    var headerFields = caseDocumentHeader.create(result.accessionOrder);

    headerFields.forEach(documentElement => {
      documentElement.forEach(fieldElement => {
        doc
          .font(fieldElement.font)
          .fontSize(fieldElement.fontSize)
          .text(fieldElement.text, fieldElement.x, fieldElement.y);
      });
    });

    doc.end();
    cb(null, { status: 'OK', message: `The case document has been created` });

  });  
}

caseDocumentOperation.processCaseDocumentOperation = processCaseDocumentOperation
caseDocumentOperation.createCaseDocument;
module.exports = caseDocumentOperation;