
var table = require('./table');
var colors = require('./colors');
var fonts = require('./fonts');

var caseDocumentFooter = {};

function create (document) {
  var tbl = table.create(10, 3, 10, 0, 560);  

  var rowHeight = 10;
  for (var i = 0; i < tbl.rows.length; i++) {
    tbl.setRowHeight(i, rowHeight);
  }

  tbl.setTop(document.page.height - tbl.height - 15);
  tbl.setColumnWidth(0, 200);
  tbl.setColumnWidth(1, 220);
  tbl.setColumnWidth(2, 180);
  tbl.center(612);  

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.darkBurntOrange)
    .text('Yellowstone Pathology Institute, Inc', tbl.columns[0].left, tbl.rows[0].top);

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.darkBurntOrange)
    .text('Billings', tbl.columns[0].left, tbl.rows[1].top);

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.darkBurntOrange)
    .text('Bozeman', tbl.columns[1].left, tbl.rows[1].top);

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.darkBurntOrange)
    .text('YellowstonePathology.com', tbl.columns[2].left, tbl.rows[1].top);

  document.lineCap('butt')
    .moveTo(tbl.left, tbl.rows[2].top - 2)
    .lineWidth(.5)
    .lineTo(tbl.left + tbl.width, tbl.rows[2].top - 2)
    .strokeColor(colors.darkBurntOrange)
    .stroke()

  // Billing Address
  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.footerTextGrey)
    .text('2900 12th Avenue North, Suite 295W', tbl.columns[0].left, tbl.rows[2].top);  

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.footerTextGrey)
  .text('Billings, Mt 59101', tbl.columns[0].left, tbl.rows[3].top);

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.black)
    .text('phone 406.238.6360  fax 406.238.6361', tbl.columns[0].left, tbl.rows[5].top);

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.black)
    .text('toll free 1.888.400.6640', tbl.columns[0].left, tbl.rows[6].top);


  // Bozeman Address
  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.footerTextGrey)
    .text('931 Hiland Blvd, Suite 3225', tbl.columns[1].left, tbl.rows[2].top);

  document
    .font(fonts.verdana)
    .fontSize(7)
    .fillColor(colors.footerTextGrey)
    .text('Bozeman, Mt 59715', tbl.columns[1].left, tbl.rows[3].top);

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.black)
    .text('phone 406.414.1004  fax 406.414.5445', tbl.columns[1].left, tbl.rows[5].top);

  document
    .font(fonts.candara)
    .fontSize(7)
    .fillColor(colors.black)
    .text('toll free 1.888.400.6640', tbl.columns[1].left, tbl.rows[6].top);

  //Pathologists

  var pathologists  = [];
  pathologists.push('Scott M. Bibbey, MD, FCAP');
  pathologists.push('Michael S. Brown, MD, FCAP');
  pathologists.push('Angela F. Durden, MD, FCAP');
  pathologists.push('Kerrie R. Emerick, MD, FCAP');
  pathologists.push('Carl D. Luem, MD, FCAP');
  pathologists.push('Christopher J. Nero, MD, FCAP');
  pathologists.push('Christopher L. Rozelle, MD, FCAP');
  pathologists.push('Kelli M. Schneider, MD, FCAP');  

  var row = 2;
  pathologists.forEach(pathologist => {    
    document
      .font(fonts.candara)
      .fontSize(7)
      .fillColor(colors.darkBurntOrange)
      .text(pathologist, tbl.columns[2].left, tbl.rows[row].top);
    row += 1;
  })  

}

caseDocumentFooter.create = create;
module.exports = caseDocumentFooter;