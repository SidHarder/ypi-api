var table = require('./table')
var moneyBox = {}

//var verdana = '/usr/share/fonts/truetype/msttcorefonts/verdana.ttf';

function create(document, accessionOrder, panelSetOrder) {
  var tbl = table.create(4, 4, 10, 220, 560);  
  tbl.center(612);

  tbl.setColumnWidth(0, 30);
  tbl.setColumnWidth(1, 200);

  document.lineWidth(1)
  document.lineCap('butt')
    .moveTo(tbl.left, tbl.top)
    .lineTo(tbl.left + tbl.width, tbl.top)
    .lineTo(tbl.left + tbl.width, tbl.top + tbl.height)
    .lineTo(tbl.left, tbl.top + tbl.height)
    .lineTo(tbl.left, tbl.top)
    .strokeColor('black')
    .stroke()

  document.lineWidth(.1)
  document.lineCap('butt')
    .moveTo(tbl.left + 2, tbl.top + 2)
    .lineTo(tbl.left + tbl.width - 2, tbl.top + 2)
    .lineTo(tbl.left + tbl.width - 2, tbl.top + tbl.height - 2)
    .lineTo(tbl.left + 2, tbl.top + tbl.height - 2)
    .lineTo(tbl.left + 2, tbl.top + 2)
    .strokeColor('black')
    .stroke()

  document
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('black')
    .text('Test', tbl.columns[1].left, tbl.rows[1].top, { underline:true });

  document
    .font('Helvetica')
    .fontSize(10)
    .fillColor('black')
    .text(panelSetOrder.panelSetName, tbl.columns[1].left, tbl.rows[2].top);

  document
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('black')
    .text('Result', tbl.columns[2].left, tbl.rows[1].top, { underline: true });

  document
    .font('Helvetica')
    .fontSize(10)
    .fillColor('black')
    .text('Detected', tbl.columns[2].left, tbl.rows[2].top);

  document
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('black')
    .text('Reference', tbl.columns[3].left, tbl.rows[1].top, { underline: true });

  document
    .font('Helvetica')
    .fontSize(10)
    .fillColor('black')
    .text('Not Detected', tbl.columns[3].left, tbl.rows[2].top);

  document
    .font('Helvetica')
    .fontSize(10)
    .fillColor('black')
    .text('Comment:', tbl.columns[1].left, tbl.rows[3].top, { width: 100, align: 'right' });
  
}

moneyBox.create = create;
module.exports = moneyBox