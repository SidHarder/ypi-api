const dotenv = require('dotenv').config();
const fs = require('fs')
const db = require('./database_operation.js')
const mapping = require('./mapping')

function writeMappingFiles(tableName) {
  let sql = `select column_name columnName, column_default columnDefault, is_nullable isNullable, data_type dataType, column_key columnKey `
    + `from information_schema.columns where table_name = '${tableName}' and table_schema = 'lis' order by column_name;`;
  
  db.executeSqlCommand(sql, function (error, result) {
    if (error) return cb(error)
    let columnMappings = []
    var i    
    for (i = 0; i < result.results.length; i++) {
      let column = {
        columnName: result.results[i].columnName,
        columnDefault: result.results[i].columnDefault,
        isNullable: result.results[i].isNullable,
        dataType: result.results[i].dataType,
        columnKey: mapping.handleJsonValue(result.results[i].columnKey),
        camelCase: convertToCamelCase(result.results[i].columnName)
      }
      columnMappings.push(column)
    }

    fs.writeFileSync('./sql_map_files/' + tableName + '_mapping.json', JSON.stringify(columnMappings))
    console.log('mapping was successfully written.')
  })
}

function convertToCamelCase(columnName) {
  return `${columnName[0].toLowerCase()}${columnName.substr(1)}`;
}

writeMappingFiles('tblWebServiceAccount')
writeMappingFiles('tblAccessionOrder');
writeMappingFiles('tblPanelSetOrder');
writeMappingFiles('tblSpecimenOrder');
