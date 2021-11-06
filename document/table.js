var table = {};

var defaultRowHeight = 15;
var defaultColumnWidth = 200;

function create(rows, columns, left, top, width) {
  var table = {};

  table.top = top;
  table.left = left;
  table.width = width;
  table.height = 0;
  table.rows = [];
  table.columns = [];

  for(var i=0; i<rows; i++) {
    table.addRow(defaultRowHeight);
  }

  for (var i = 0; i < columns; i++) {
    table.addColumn(defaultColumnWidth);
  }

  table.addRow = addRow;
  table.addColumn = addColumn;
  table.setTop = setTop;
  table.setLeft = setLeft;
  table.center = center;

  return table;
}

table.addRow = function (rowHeight) {
  var newRow = { height: rowHeight, top: table.height, height: rowHeight };
  table.rows.push(newRow);
  table.height += rowHeight;
}

table.addColumn = function (columnWidth) {
  var newColumn = { width: columnWidth, left: table.width, width: columnWidth };
  table.columns.push(newColumn);
  table.width += columnWidth;
}

function setTop(top) {
  table.top = top;
  var runningTop = top;
  table.rows.forEach(row => {        
    row.top = runningTop;
    runningTop += row.height;
  });
}

function setLeft(left) {
  table.left = left;
  var runningLeft = left;
  table.columns.forEach(column => {
    column.left = runningLeft;
    runningLeft += column.width;
  })
}

function center(pageWidth) {
  table.left = (pageWidth - table.width)/2;
  var runningLeft = table.left;
  table.columns.forEach(column => {
    column.left = runningLeft;
    runningLeft += column.width;
  })
}

table.create = create;
module.exports = table;