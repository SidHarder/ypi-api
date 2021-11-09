var table = require('./table')
var moneyBox = {}

//var verdana = '/usr/share/fonts/truetype/msttcorefonts/verdana.ttf';

function create(document, accessionOrder, panelSetOrder) {
  var tbl = table.create(5, 4, 10, 220, 560);  
  tbl.center(612);

  tbl.setColumnWidth(0, 30);
  tbl.setColumnWidth(1, 200);

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
    .text('Comment:', tbl.columns[1].left, tbl.rows[3].top);

  var commentHeaderWidth = document.widthOfString('Comment:');
  var commentText = `PDFKit includes support for line wrapping out of the box! If no options are given, text is automatically wrapped within the page margins and placed in the document flow below any previous text, or at the top of the page. PDFKit automatically inserts new pages as necessary so you don't have to worry about doing that for long pieces of text.PDFKit can also automatically wrap text into multiple columns.`;
  var commentTextHeight = document.heightOfString(commentText, { align: 'left', width: 400 });
  tbl.setRowHeight(3, commentTextHeight);

  document
    .font('Helvetica')
    .fontSize(10)
    .fillColor('black')
    .text(commentText, tbl.columns[1].left + commentHeaderWidth + 3, tbl.rows[3].top, { align: 'left', width: 400 });


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
}

moneyBox.create = create;
module.exports = moneyBox