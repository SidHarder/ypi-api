const fs = require('fs')

const mapping = {}

function getMapping(tableName, cb) {
  fs.readFile('./sql_map_files/' + tableName + '_mapping.json', 'utf8', (err, jsonString) => {
    if (err) return cb(err)
    cb(null, JSON.parse(jsonString))
  })
}

function handleSqlValue(column, value) {
  let result = value

  if (value != undefined || value != null) {
    let escapedValue = escapeSpecialCharacters(value)
    switch (column.dataType) {
      case 'tinyint':
        result = convertBoolean(escapedValue)
        break
      default:
        result = `'${escapedValue}'`
        break
    }
  } else {
    result = null
  }

  return result
}

function handleJsonValue(value) {
  if (value == undefined || value == '') {
    return null
  } else {
    return value
  }
}

function escapeSpecialCharacters(value) {
  let result = value.toString()
  if (result != null && result != '') {
    result = result.replace(/'/g, `''`)
  }
  return result
}

function convertBoolean(value) {
  let result = value
  if (value) {
    if (value == true) {
      result = 1
    } else if (value.toUpperCase() == 'FALSE' || value.toUpperCase() == 'NO') {
      result = 0
    }
  } else {
    result = 0
  }
  return result
}

function convertToCamelCase(columnName) {
  return `${columnName[0].toLowerCase()}${columnName.substr(1)}`;
}

function toCamelCase(tableMapping, sqlResult) {
  var result = { rowOperationType: 'Update' };
  tableMapping.forEach(function (column, index) {
    var value = sqlResult[column.columnName];
    if (column.dataType == 'tinyint') value = mapping.convertSQLBooleanToJSON(value);
    if (column.dataType == 'datetime') value = mapping.convertSQLDateTimeToJSON(value);
    if (column.dataType == 'varchar') value = mapping.handleJsonValue(value);
    //if (column.dataType == 'json') value = mapping.handleJsonObjectValue(value);
    result[column.camelCase] = value;
  });  

  return result;
}

function convertSQLBooleanToJSON(value) {
  let result = value
  if (value) {
    if (value == 1) {
      result = true
    } else if (value.toUpperCase() == "FALSE" || value.toUpperCase() == "NO") {
      result = false
    }
  } else {
    result = false
  }
  return result
}

function convertSQLDateTimeToJSON(value) {
  if (value == undefined || value == '') {
    return null;
  } else {
    return moment(value).format('YYYYMMDDHHmmss');
  }
}

mapping.convertSQLBooleanToJSON = convertSQLBooleanToJSON;
mapping.convertSQLDateTimeToJSON = convertSQLDateTimeToJSON;
mapping.convertToCamelCase = convertToCamelCase;
mapping.getMapping = getMapping
mapping.handleSqlValue = handleSqlValue
mapping.handleJsonValue = handleJsonValue

module.exports = mapping
