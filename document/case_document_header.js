var moment = require('moment');

var accessionOrderHandler = require('../accession_order_handler')

var caseDocumentHeader = [];
var verdana = '/usr/share/fonts/truetype/msttcorefonts/verdana.ttf';

var pageMargin = {
  top: 25,
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

function create(accessionOrder) {
  var result = [];

  headerTable.columns.push({ left: headerTable.left + 5 });
  headerTable.columns.push({ left: headerTable.left + 60 });
  headerTable.columns.push({ left: headerTable.left + 400 });
  headerTable.columns.push({ left: headerTable.left + 480 });

  headerTable.rows.push({ top: headerTable.top + 0 });
  headerTable.rows.push({ top: headerTable.top + 20 });
  headerTable.rows.push({ top: headerTable.top + 40 });

  

  var patient = [
    {
      text: 'Patient:',
      font: verdana,
      x: headerTable.columns[0].left,
      y: headerTable.rows[0].top,
      fontSize: 10
    },
    {
      text: getPatientName(accessionOrder),
      font: verdana,
      x: headerTable.columns[1].left,
      y: headerTable.rows[0].top,
      fontSize: 12
    }
  ]

  var dateOfBirth = [
    {
      text: getCaseHeaderDateOfBirth(accessionOrder),
      font: verdana,
      x: headerTable.columns[2].left,
      y: headerTable.rows[0].top,
      fontSize: 10
    }    
  ]

  var provider = [
    {
      text: 'Provider:',
      font: verdana,
      x: headerTable.columns[0].left,
      y: headerTable.rows[1].top,
      fontSize: 10
    },
    {
      text: accessionOrder.physicianName,
      font: verdana,
      x: headerTable.columns[1].left,
      y: headerTable.rows[1].top,
      fontSize: 10
    },
    {
      text: accessionOrder.clientName,
      font: verdana,
      x: headerTable.columns[1].left,
      y: headerTable.rows[2].top,
      fontSize: 10
    }
  ]

  var dateOfReport = [
    {
    text: 'Date of report:',
      font: verdana,
      x: headerTable.columns[2].left,
      y: headerTable.rows[1].top,
      fontSize: 10
    },
    {
      text: moment(accessionOrder.accessionTime).format('MM-DD-YYYY hh:mm'),
      font: verdana,
      x: headerTable.columns[3].left,
      y: headerTable.rows[1].top,
      fontSize: 10
    }
  ]

  result.push(patient);
  //result.push(dateOfBirth);
  result.push(provider);
  result.push(dateOfReport);
  return result;
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