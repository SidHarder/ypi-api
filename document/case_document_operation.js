var db = require('../database_operation.js');
var fs = require('fs');
var PDFDocument = require('pdfkit');

var caseDocumentHeader = require('./case_document_header');
var moneyBox = require('./money_box');

var accessionOrderHandler = require('../accession_order_handler.js');
var caseDocumentOperation = {}

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

    var verdana = '/usr/share/fonts/truetype/msttcorefonts/verdana.ttf';
    var margins = { margins: { top: 5, bottom: 5, left: 5, right: 5 } }
    var doc = new PDFDocument(margins);
    doc.pipe(fs.createWriteStream('/home/sharder/pdf_files/output.pdf'));
    
    var accessionOrder = result.accessionOrder;
    var panelSetOrder = result.accessionOrder.panelSetOrders[0];    

    doc.image('./logo.jpg', 20, 20, { width: 200 });

    doc.lineWidth(1)
    doc.lineCap('butt')
      .moveTo(90, 65)
      .lineTo(570, 65)
      .strokeColor('#DE7F1F')
      .stroke()

    doc
      .font(verdana)
      .fontSize(16)
      .fillColor('#DE7F1F')
      .text(panelSetOrder.panelSetName, 20, 20, { width: 550, align: 'right' });
    
    doc
      .font(verdana)
      .fontSize(14)
      .fillColor('black')
      .text(`YPI Report #: ${panelSetOrder.reportNo}`, 20, 70, { width: 550, align: 'right' });
    
    caseDocumentHeader.create(doc, accessionOrder, panelSetOrder);
    moneyBox.create(doc, accessionOrder, panelSetOrder);
    
    doc.end();
    cb(null, { status: 'OK', message: `The case document has been created` });

  });  
}

caseDocumentOperation.processCaseDocumentOperation = processCaseDocumentOperation
caseDocumentOperation.createCaseDocument;
module.exports = caseDocumentOperation;