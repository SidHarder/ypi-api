var table = {};

var defaultRowHeight = 15;
var defaultColumnWidth = 100;

function create(rows, columns, left, top, width) {
  var table = {};

  table.top = top;
  table.left = left;
  table.right = left + width;
  table.width = width;
  table.height = rows * defaultRowHeight;
  table.rows = [];
  table.columns = [];  

  table.addRow = addRow;
  table.addColumn = addColumn;
  table.setTop = setTop;
  table.setLeft = setLeft;
  table.center = center;
  table.setColumnWidth = setColumnWidth;

  for (var i = 0; i < rows; i++) {
    table.addRow(defaultRowHeight);
  }

  for (var i = 0; i < columns; i++) {
    table.addColumn(defaultColumnWidth);
  }

  return table;
}

function addRow(rowHeight) {
  var runningTop = this.top;
  this.rows.forEach(row => {
    runningTop += row.height;
  });
  var newRow = { height: rowHeight, top: runningTop, height: rowHeight };  
  this.rows.push(newRow);  
}

function addColumn(columnWidth) {
  var runningLeft = this.left;
  this.columns.forEach(column => {
    runningLeft += column.width;
  });
  var newColumn = { width: columnWidth, left: runningLeft, width: columnWidth };
  this.columns.push(newColumn);  
}

function setTop(top) {
  this.top = top;
  var runningTop = top;
  this.rows.forEach(row => {        
    row.top = runningTop;
    runningTop += row.height;
  });
}

function setLeft(left) {
  this.left = left;
  var runningLeft = left;
  this.columns.forEach(column => {
    column.left = runningLeft;
    runningLeft += column.width;
  })
}

function center(pageWidth) {
  this.left = Math.round((pageWidth - this.width)/2);
  var runningLeft = this.left;
  this.columns.forEach(column => {
    column.left = runningLeft;
    runningLeft += column.width;
  })
}

function setColumnWidth(column, width) {
  this.columns[column].width = width;
  var runningLeft = this.left;
  this.columns.forEach(column => {
    column.left = runningLeft;
    runningLeft += column.width;
  })
}

table.create = create;
module.exports = table;