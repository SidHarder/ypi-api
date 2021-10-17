const db = require('../database_operation.js');
var fs = require('fs');
const PDFDocument = require('pdfkit');

var caseDocumentHeader = require('./case_document_header');
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
  console.log(args.fileName)
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
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('/home/sharder/pdf_files/output.pdf'));
  caseDocumentHeader.forEach(documentElement => {
    documentElement.forEach(fieldElement => {
      doc
        .font(fieldElement.font)
        .fontSize(fieldElement.fontSize)
        .text(fieldElement.text, fieldElement.x, fieldElement.y);
    });
  });

  /*
  doc
    .font('/usr/share/fonts/truetype/msttcorefonts/verdana.ttf')
    .fontSize(25)
    .text(doi, 100, 100);
  */
  doc.end();  
  cb(null, { status: 'OK', message: `The case document has been created` });
}

caseDocumentOperation.processCaseDocumentOperation = processCaseDocumentOperation
caseDocumentOperation.createCaseDocument;
module.exports = caseDocumentOperation;