var moment = require('moment');

var table = require('./table');
var colors = require('./colors');
var fonts = require('./fonts');

var accessionOrderHandler = require('../accession_order_handler')

var caseDocumentHeader = {};

var verdana = process.env.FONT_VERDANA;
var verdanaBold = process.env.FONT_VERDANA_BOLD;
var verdanaItalic = process.env.FONT_VERDANA_ITALIC;

//var verdana = '/usr/share/fonts/truetype/msttcorefonts/verdana.ttf';

var tbl = table.create(6, 4, 25, 110, 560);

function create(document, accessionOrder, panelSetOrder) {    

  tbl.setColumnWidth(0, 50);
  tbl.setColumnWidth(1, 300);

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)        
    .text('Patient:', tbl.columns[0].left, tbl.rows[0].top);
  
  var patientName = getPatientName(accessionOrder);
  document
    .font(verdanaBold)
    .fillColor(colors.black)
    .fontSize(12)
    .text(patientName, tbl.columns[1].left, tbl.rows[0].top);
    
  var patientTextWidth = document.widthOfString(patientName);

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(10)
    .text(getCaseHeaderDateOfBirth(accessionOrder), tbl.columns[1].left + patientTextWidth + 10, tbl.rows[0].top);
      
  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text('Provider:', tbl.columns[0].left, tbl.rows[2].top);      

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text(accessionOrder.physicianName, tbl.columns[1].left, tbl.rows[2].top);
  
  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text(accessionOrder.clientName, tbl.columns[1].left, tbl.rows[3].top);      
  
  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text('Date of report:', tbl.columns[2].left, tbl.rows[1].top, { width: tbl.columns[2].width - 10, align: 'right' });
  
  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text(moment(panelSetOrder.finalTime).format('MM/DD/YYYY hh:mm'), tbl.columns[3].left, tbl.rows[1].top);
    
  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text('Accessioned:', tbl.columns[2].left, tbl.rows[2].top, { width: tbl.columns[2].width - 10, align: 'right' });
  
  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text(moment(panelSetOrder.accessionTime).format('MM/DD/YYYY hh:mm'), tbl.columns[3].left, tbl.rows[2].top);  

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text('Date of service:', tbl.columns[2].left, tbl.rows[3].top, { width: tbl.columns[2].width - 10, align: 'right' });

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text(moment(accessionOrder.collectionDate).format('MM/DD/YYYY'), tbl.columns[3].left, tbl.rows[3].top);

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text('Client MRN:', tbl.columns[2].left, tbl.rows[4].top, { width: tbl.columns[2].width - 10, align: 'right' });

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text(accessionOrder.svhMedicalRecord, tbl.columns[3].left, tbl.rows[4].top);

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text('Client ACCT:', tbl.columns[2].left, tbl.rows[5].top, { width: tbl.columns[2].width - 10, align: 'right' });

  document
    .font(fonts.verdana)
    .fillColor(colors.black)
    .fontSize(9)
    .text(accessionOrder.svhAccount, tbl.columns[3].left, tbl.rows[5].top);
}

function getCaseHeaderDateOfBirth(accessionOrder) {
  var dob = moment(accessionOrder.pBirthdate, 'YYYY-MM-DD hh:mm:ss');
  var age = moment().diff(dob, 'years');
  var result = 'DOB';

  if (accessionOrder.pBirthdate) {
    result = `(DOB ${dob.format('MM/DD/YYYY')} ${age}YO ${accessionOrder.pSex})`;
  }
  return result;
}

function getPatientName(accessionOrder) {
  var patientName = `${accessionOrder.pLastName}, ${accessionOrder.pFirstName}`;
  return patientName;
}

caseDocumentHeader.create = create;
module.exports = caseDocumentHeader;