var moment = require('moment');

var accessionOrderHandler = require('../accession_order_handler')

var caseDocumentHeader = [];
var verdana = '/usr/share/fonts/truetype/msttcorefonts/verdana.ttf';

var pageMargin = {
  top: 110,
  left: 25
};

var headerTable = {
  width: 10000,
  height: 10000,
  top: pageMargin.top,
  left: pageMargin.left,
  columns: [],
  rows: []
};

function create(document, accessionOrder, panelSetOrder) {  
  headerTable.columns.push({ left: headerTable.left + 5, width: 55 });
  headerTable.columns.push({ left: headerTable.left + 60, width: 320 });
  headerTable.columns.push({ left: headerTable.left + 360, width: 100 });
  headerTable.columns.push({ left: headerTable.left + 460, width: 100 });

  headerTable.rows.push({ top: headerTable.top + 0 });
  headerTable.rows.push({ top: headerTable.top + 20 });
  headerTable.rows.push({ top: headerTable.top + 36 });
  headerTable.rows.push({ top: headerTable.top + 52 });
  headerTable.rows.push({ top: headerTable.top + 68 });
  headerTable.rows.push({ top: headerTable.top + 84 });
  
  document
    .font(verdana)    
    .fillColor('black')
    .fontSize(9)        
    .text('Patient:', headerTable.columns[0].left, headerTable.rows[0].top);
  
  var patientName = getPatientName(accessionOrder);
  document
    .font(verdana)
    .fillColor('black')
    .fontSize(12)
    .text(patientName, headerTable.columns[1].left, headerTable.rows[0].top);      
    
  var patientTextWidth = document.widthOfString(patientName);

  document
    .font(verdana)
    .fillColor('black')
    .fontSize(10)
    .text(getCaseHeaderDateOfBirth(accessionOrder), headerTable.columns[1].left + patientTextWidth + 10, headerTable.rows[0].top);
      
  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text('Provider', headerTable.columns[0].left, headerTable.rows[2].top);      

  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text(accessionOrder.physicianName, headerTable.columns[1].left, headerTable.rows[2].top);
  
  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text(accessionOrder.clientName, headerTable.columns[1].left, headerTable.rows[3].top);      
  
  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text('Date of report:', headerTable.columns[2].left, headerTable.rows[1].top, { width: headerTable.columns[2].width - 10, align: 'right' });
  
  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text(moment(panelSetOrder.finalTime).format('MM/DD/YYYY hh:mm'), headerTable.columns[3].left, headerTable.rows[1].top);
    
  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text('Accessioned:', headerTable.columns[2].left, headerTable.rows[2].top, { width: headerTable.columns[2].width - 10, align: 'right' });
  
  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text(moment(panelSetOrder.accessionTime).format('MM/DD/YYYY hh:mm'), headerTable.columns[3].left, headerTable.rows[2].top);  

  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text('Date of service:', headerTable.columns[2].left, headerTable.rows[3].top, { width: headerTable.columns[2].width - 10, align: 'right' });

  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text(moment(accessionOrder.collectionDate).format('MM/DD/YYYY'), headerTable.columns[3].left, headerTable.rows[3].top);

  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text('Client MRN:', headerTable.columns[2].left, headerTable.rows[4].top, { width: headerTable.columns[2].width - 10, align: 'right' });

  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text(accessionOrder.svhMedicalRecord, headerTable.columns[3].left, headerTable.rows[4].top);

  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text('Client ACCT:', headerTable.columns[2].left, headerTable.rows[5].top, { width: headerTable.columns[2].width - 10, align: 'right' });

  document
    .font(verdana)
    .fillColor('black')
    .fontSize(9)
    .text(accessionOrder.svhAccount, headerTable.columns[3].left, headerTable.rows[5].top);
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