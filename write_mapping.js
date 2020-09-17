const fs = require('fs')
const db = require('./db.js')
const mapping = require('./mapping')
const localSettings = require('./local_settings.json')

function writeMappingFiles(tableName) {
    let sql = 'select column_name `columnName`, column_default `columnDefault`, is_nullable `isNullable`, data_type `dataType`, column_key `columnKey` ' +
        'from information_schema.columns where table_name = \'' + tableName + '\' and table_schema = \''  + localSettings.mySql.database + '\'' +
        'order by column_name;'
    
    db.executeSqlCommand(sql, function (error, result) {
        if (error) return cb(error)
        let columnMappings = []
        var i
        for (i = 0; i < result.queryResult.length; i++) {
            let column = { 
                columnName: result.queryResult[i].columnName,
                columnDefault: result.queryResult[i].columnDefault,
                isNullable: result.queryResult[i].isNullable,
                dataType: result.queryResult[i].dataType,
                columnKey: mapping.handleJsonValue(result.queryResult[i].columnKey),
                camelCase: convertToCamelCase(result.queryResult[i].columnName)
            }            
            columnMappings.push(column)
        }
    
        fs.writeFileSync('./sql_map_files/' + tableName + '_mapping.json', JSON.stringify(columnMappings))
        console.log('mapping was successfully written.')
    })
}

function convertToCamelCase(columnName) {    
    let result = ''
    var underscoreSplit = columnName.split('_')
    for(let i = 0; i < underscoreSplit.length; i++) {
        if(i == 0) {
            result += underscoreSplit[i]
        } else {
            result += underscoreSplit[i].substr(0, 1).toUpperCase() + underscoreSplit[i].substr(1)
        }
    }
    return result
}

writeMappingFiles('tblWebServiceAccount')