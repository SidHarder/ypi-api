var colors = require('./colors');
var fonts = require('./fonts');
var table = require('./table');

var moneyBox = {}

var verdana = process.env.FONT_VERDANA;
var verdanaBold = process.env.FONT_VERDANA_BOLD;
var verdanaItalic = process.env.FONT_VERDANA_ITALIC;
//var verdana = '/usr/share/fonts/truetype/msttcorefonts/verdana.ttf';

function create(document, accessionOrder, panelSetOrder, specimenOrder) {
  var tbl = table.create(17, 4, 10, 200, 560);  
  tbl.center(612);

  tbl.setColumnWidth(0, 30);
  tbl.setColumnWidth(1, 200);
  tbl.setColumnWidth(2, 200);  

  document
    .font(verdanaBold)
    .fontSize(10)
    .fillColor(colors.black)
    .text('Test', tbl.columns[1].left, tbl.rows[1].top, { underline:true });

  document
    .font(verdana)
    .fontSize(10)
    .fillColor(colors.black)
    .text(panelSetOrder.panelSetName, tbl.columns[1].left, tbl.rows[2].top);

  document
    .font(verdanaBold)
    .fontSize(10)
    .fillColor(colors.black)
    .text('Result', tbl.columns[2].left, tbl.rows[1].top, { underline: true });

  document
    .font(verdana)
    .fontSize(10)
    .fillColor(colors.black)
    .text('Detected', tbl.columns[2].left, tbl.rows[2].top);

  document
    .font(verdanaBold)
    .fontSize(10)
    .fillColor(colors.black)
    .text('Reference', tbl.columns[3].left, tbl.rows[1].top, { underline: true });

  document
    .font(verdana)
    .fontSize(10)
    .fillColor(colors.black)
    .text('Not Detected', tbl.columns[3].left, tbl.rows[2].top);  

  var commentHeaderWidth = document.widthOfString('Comment:');
  var commentText = panelSetOrder.aptimaSarscov2Result.comment;
  var commentTextHeight = document.heightOfString(commentText, { align: 'left', width: 400 }) + 10;
  tbl.setRowHeight(3, commentTextHeight);

  document
    .font(verdana)
    .fontSize(8)
    .fillColor(colors.black)
    .text('Comment:', tbl.columns[1].left, tbl.rows[3].top + 5);

  document
    .font(verdana)
    .fontSize(8)
    .fillColor(colors.black)
    .text(commentText, tbl.columns[1].left + commentHeaderWidth + 3, tbl.rows[3].top + 5, { align: 'left', width: 400 });

  document.lineWidth(1)
  document.lineCap('butt')
    .moveTo(tbl.left, tbl.top)
    .lineTo(tbl.left + tbl.width, tbl.top)
    .lineTo(tbl.left + tbl.width, tbl.rows[5].top)
    .lineTo(tbl.left, tbl.rows[5].top)
    .lineTo(tbl.left, tbl.top)
    .strokeColor(colors.black)
    .stroke()

  document.lineWidth(.1)
  document.lineCap('butt')
    .moveTo(tbl.left + 2, tbl.top + 2)
    .lineTo(tbl.left + tbl.width - 2, tbl.top + 2)
    .lineTo(tbl.left + tbl.width - 2, tbl.rows[5].top - 2)
    .lineTo(tbl.left + 2, tbl.rows[5].top - 2)
    .lineTo(tbl.left + 2, tbl.top + 2)
    .strokeColor(colors.black)
    .stroke()

  document
    .font(verdanaBold)
    .fontSize(9)
    .fillColor(colors.black)
    .text('Specimen Description', tbl.columns[0].left, tbl.rows[6].top, { underline: true});

  document
    .font(verdana)
    .fontSize(8)
    .fillColor(colors.black)
    .text(specimenOrder.description, tbl.columns[0].left, tbl.rows[7].top);

  document
    .font(verdanaBold)
    .fontSize(9)
    .fillColor(colors.black)
    .text('Collection Date/Time', tbl.columns[2].left, tbl.rows[6].top, { underline: true });

  document
    .font(verdana)
    .fontSize(8)
    .fillColor(colors.black)
    .text(specimenOrder.collectionDate, tbl.columns[2].left, tbl.rows[7].top);

  tbl.setRowHeight(8, 18);
  document
    .font(verdanaBold)
    .fontSize(9)
    .fillColor(colors.black)
    .text('Method', tbl.columns[0].left, tbl.rows[8].top + 5, { underline: true });

  document.fontSize(8)
  var presentationWidth = 550;
  var methodText = panelSetOrder.aptimaSarscov2Result.method;
  var methodTextHeight = document.heightOfString(methodText, { align: 'left', width: presentationWidth });
  tbl.setRowHeight(9, methodTextHeight);
  
  document
    .font(verdana)
    .fontSize(8)
    .fillColor(colors.black)
    .text(methodText, tbl.columns[0].left, tbl.rows[9].top, { width: presentationWidth });
  
  tbl.setRowHeight(10, 18);
  document
    .font(verdanaBold)
    .fontSize(9)
    .fillColor(colors.black)
    .text('References', tbl.columns[0].left, tbl.rows[10].top + 5, { underline: true });
  
  document.fontSize(8)
  var referencesText = panelSetOrder.reportReferences;
  var referencesTextHeight = document.heightOfString(referencesText, { align: 'left', width: presentationWidth });
  tbl.setRowHeight(11, referencesTextHeight);presentationWidth

  document
    .font(verdana)
    .fontSize(8)
    .fillColor(colors.black)
    .text(referencesText, tbl.columns[0].left, tbl.rows[11].top);



  document.fontSize(6);
  var asrText = panelSetOrder.aptimaSarscov2Result.aSRComment;
  var asrTextHeight = document.heightOfString(asrText, { align: 'left', width: presentationWidth });
  tbl.setRowHeight(13, asrTextHeight);

  document
    .font(verdana)
    .fontSize(6)
    .fillColor(colors.black)
    .text(asrText, tbl.columns[0].left, tbl.rows[13].top, { align: 'left', width: presentationWidth });
  
}

moneyBox.create = create;
module.exports = moneyBox