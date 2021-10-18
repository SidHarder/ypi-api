
const caseDocumentHeader = [];

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

function create() {
  var result = [];

  headerTable.columns.push({ left: headerTable.left + 5 });
  headerTable.columns.push({ left: headerTable.left + 50 });
  headerTable.columns.push({ left: headerTable.left + 200 });

  headerTable.rows.push({ top: headerTable.top + 5 });

  var patient = [
    {
      text: 'Patient:',
      font: verdana,
      x: headerTable.columns[0].left,
      y: headerTable.rows[0].top,
      fontSize: 10
    },
    {
      text: 'Mickey E. Mouse',
      font: verdana,
      x: headerTable.columns[1].left,
      y: headerTable.rows[0].top,
      fontSize: 12
    }
  ]

  var dateOfBirth = [
    {
      text: '(10/1/1966)',
      font: verdana,
      x: headerTable.columns[2].left,
      y: headerTable.rows[0].top,
      fontSize: 10
    }
  ]

  result.push(patient);
  result.push(dateOfBirth);
  return result;
}

caseDocumentHeader.create = create;
module.exports = caseDocumentHeader;