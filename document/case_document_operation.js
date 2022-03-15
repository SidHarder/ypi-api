var db = require('../database_operation.js');
var path = require('path');

var fs = require('fs');
var PDFDocument = require('pdfkit');

var colors = require('./colors');
var fonts = require('./fonts');

var caseDocumentHeader = require('./case_document_header');
var moneyBox = require('./money_box');
var caseDoumentFooter = require('./case_document_footer');

var accessionOrderHandler = require('../accession_order_handler.js');
const caseDocumentFooter = require('./case_document_footer');
const fileStructure = require('./file_structure');

var caseDocumentOperation = {}

var operationMap = [
  { method: 'getCaseDocument', mappedMethod: getCaseDocument },
  { method: 'createCaseDocument', mappedMethod: createCaseDocument },
  { method: 'addCaseFolders', mappedMethod: fileStructure.addCaseFolders },
  { method: 'getCasePath', mappedMethod: fileStructure.getCasePath },
  { method: 'getCaseDocumentList', mappedMethod: getCaseDocumentList }
]

function processCaseDocumentOperation(args, cb) {
  var operationMethod = operationMap.find((r) => r.method == args[0].caseDocumentOperation.method);
  if (operationMethod) {
    operationMethod.mappedMethod(args[0].caseDocumentOperation, cb);
  } else {
    cb(null, { status: 'ERROR', message: `Method Not Found` });
  }
}

function getCaseDocumentList(args, cb) {
  var masterAccessionNo = args.masterAccessionNo;
  if (!masterAccessionNo) {
    console.log(`A masterAccessionNo was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `A masterAccessionNo was not provided as an argument.` });
  }

  fileStructure.getCasePath({ masterAccessionNo: masterAccessionNo }, function (error, result) {   
    var fullPath = path.join(process.env.ACCESSION_DOCUMENT_PATH, result.casePath);    
    fs.readdir(fullPath, function (err, files) {      
      if (err) return cb(null, { status: 'ERROR', err });
      documents = files.map(function(f) {
        return { fileName: f, fullPath: result.casePath }
      });

      cb(null, { status: 'OK', documents });
    });    
  })  
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
    doc.pipe(fs.createWriteStream(`${process.env.ACCESSION_DOCUMENT_PATH}/output.pdf`));    

    var accessionOrder = result.accessionOrder;
    var panelSetOrder = result.accessionOrder.panelSetOrders[0];  
    var specimenOrder = result.accessionOrder.specimenOrders[0];  

    doc.image('./logo.jpg', 20, 20, { width: 200 });    

    doc.lineWidth(.75)
    doc.lineCap('butt')
      .moveTo(90, 66)
      .lineTo(570, 66)
      .strokeColor(colors.burntOrange)
      .stroke()

    doc
      .font(fonts.verdana)
      .fontSize(16)
      .fillColor(colors.darkBurntOrange)
      .text(panelSetOrder.panelSetName, 20, 20, { width: 550, align: 'right' });
    
    doc
      .font(fonts.verdana)
      .fontSize(14)
      .fillColor(colors.black)
      .text(`YPI Report #: ${panelSetOrder.reportNo}`, 20, 70, { width: 550, align: 'right' });
    
    caseDocumentHeader.create(doc, accessionOrder, panelSetOrder);
    moneyBox.create(doc, accessionOrder, panelSetOrder, specimenOrder);
    caseDocumentFooter.create(doc);
    
    doc.end();
    cb(null, { status: 'OK', message: `The case document has been created` });

  });  
}

caseDocumentOperation.processCaseDocumentOperation = processCaseDocumentOperation
caseDocumentOperation.createCaseDocument;
module.exports = caseDocumentOperation;