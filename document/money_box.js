var table = require('./table')
var moneyBox = {}

var verdana = '/usr/share/fonts/truetype/msttcorefonts/verdana.ttf';

function create(document, accessionOrder, panelSetOrder) {
  var tbl = table.create(2, 4);
  tbl.setTop(300);
  tbl.center(700);

  document
    .font(verdana)
    .fontSize(10)
    .fillColor('black')
    .text('Test', tbl.columns[0].left, tbl.rows[0].top);

  document
    .font(verdana)
    .fontSize(10)
    .fillColor('black')
    .text('Result', tbl.columns[1].left, tbl.rows[0].top);

  document
    .font(verdana)
    .fontSize(10)
    .fillColor('black')
    .text('Reference', tbl.columns[2].left, tbl.rows[0].top);

}

moneyBox.create = create;
module.exports = moneyBox