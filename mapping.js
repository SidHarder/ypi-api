const fs = require('fs')
const moment = require('moment');

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
    if (column.dataType == 'varchar') var sanitizedValue = mapping.handleJsonValue(value);
    //if (column.dataType == 'json') value = mapping.handleJsonObjectValue(value);
    result[column.camelCase] = value;
  });  

  return result;
}

function convertSQLBooleanToJSON(value) {
  let result = value  
  if (value == 1) {
    result = true
  } else {
    result = false
  }  
  return result
}

function convertSQLDateTimeToJSON(value) {
  if (value == undefined || value == '') {
    return null;
  } else {
    return moment(value).format('YYYY-MM-DD hh:mm:ss');
  }
}

function pushSqlStatements(tableMapping, tableName, domainObject, sqlStatements) {
  domainObject.forEach(function (obj, index) {
    pushSqlStatement(tableMapping, tableName, domainObject, sqlStatements);
  })
}

function pushSqlStatement(tableMapping, tableName, domainObject, sqlStatements) {
  switch (domainObject.rowOperationType) {
    case 'Update':
      pushUpdateStatement(tableMapping, tableName, domainObject, sqlStatements)
      break;
    case 'Insert':
      pushInsertStatement(tableMapping, tableName, domainObject, sqlStatements)
      break;
    case 'Delete':
      break;
  }
}

function pushInsertStatement(tableMapping, tableName, domainObject, sqlStatements) {
  console.log(`-------> Running pushInsertStatement`)
  var hasInserts = false;
  if (domainObject.rowOperationType == 'Insert') {
    hasInserts = true;
    var sqlInsert = `Insert ${tableName} `;
    var sqlFields = [];
    var sqlValues = [];
    tableMapping.forEach(function (column, index) {
      sqlFields.push(column.columnName);
      var value = domainObject[column.camelCase];
      if (column.dataType == 'tinyint') value = mapping.convertJsonBooleanToSql(value);
      if (column.dataType == 'datetime') value = mapping.convertJsonDateTimeToSql(value);
      if (column.dataType == 'timestamp') value = `'${moment().format('YYYYMMDDHHmmss')}'`;
      if (column.dataType == 'varchar' || column.dataType == 'text' || column.dataType == 'mediumtext') {
        value = mapping.convertJsonValueToSql(value);
      }
      if (column.dataType == 'json') value = mapping.convertJsonToJsonSql(value);
      sqlValues.push(value);
    });

    domainObject.rowOperationType = 'Update'
    sqlInsert = `${sqlInsert} (${sqlFields}) values (${sqlValues})`;
    sqlStatements.push(sqlInsert)

    //This clone should only be one level deep -- this could be a problem, not sure yet.
    domainObject.clone = JSON.parse(JSON.stringify(domainObject));
  }
}

function pushUpdateStatement(tableMapping, tableName, domainObject, sqlStatements) {
  var hasChanges = false;
  if (domainObject.rowOperationType == 'Update') {
    var sqlUpdate = `Update ${tableName} set `;
    tableMapping.forEach(function (column, index) {
      if (column.tableName == tableName) {
        if (domainObject[column.camelCase] != domainObject.clone[column.camelCase]) {
          hasChanges = true;
          var value = domainObject[column.camelCase];
          if (column.dataType == 'tinyint') value = mapping.convertJsonBooleanToSql(value);
          if (column.dataType == 'datetime') value = mapping.convertJsonDateTimeToSql(value);
          if (column.dataType == 'timestamp') value = `'${moment().format('YYYYMMDDHHmmss')}'`;
          if (column.dataType == 'varchar' || column.dataType == 'text') value = mapping.convertJsonValueToSql(value);
          if (column.dataType == 'json') value = mapping.convertJsonToJsonSql(value);
          sqlUpdate += `${column.columnName}=${value}, `;
          domainObject.clone[column.camelCase] = domainObject[column.camelCase];
        }
      }
    });

    if (hasChanges == true) {
      sqlUpdate = sqlUpdate.substring(0, sqlUpdate.length - 2)
      var primaryKey = tableMapping.find(field => field.columnKey == 'PRI');
      sqlUpdate += ` where ${primaryKey.columnName} = '${domainObject[primaryKey.camelCase]}';`;
      sqlStatements.push(sqlUpdate)
    }
  }
}

function convertJsonValueToSql(value) {
  if (value == null || value == undefined || value == '') {
    return 'null'
  } else {
    return `'${escapeSpecialCharacters(value)}'`;
  }
}

function convertJsonDateTimeToSql(value) {
  if (value == undefined || value == '') {
    return 'null';
  } else {
    var noDashValue = value.replace(/-/g, '');
    var noSpaceValue = noDashValue.replace(/ /g, '');
    var noColonValue = noSpaceValue.replace(/:/g, '');
    var paddedValue = noColonValue.padEnd(14, '0');
    return `'${paddedValue}'`;
  }
}

mapping.convertSQLBooleanToJSON = convertSQLBooleanToJSON;
mapping.convertSQLDateTimeToJSON = convertSQLDateTimeToJSON;
mapping.convertToCamelCase = convertToCamelCase;
mapping.getMapping = getMapping;
mapping.handleSqlValue = handleSqlValue;
mapping.handleJsonValue = handleJsonValue;
mapping.toCamelCase = toCamelCase;
mapping.pushSqlStatement = pushSqlStatement;
mapping.convertJsonValueToSql = convertJsonValueToSql;
mapping.convertJsonDateTimeToSql = convertJsonDateTimeToSql;
module.exports = mapping
