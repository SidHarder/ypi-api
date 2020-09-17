const fs = require('fs')

const mapping = {}

function getMapping (tableName, cb)
{
    fs.readFile('./sql_map_files/' + tableName + '_mapping.json', 'utf8', (err, jsonString) => {
        if (err) return cb(err)        
        cb(null, JSON.parse(jsonString))
    })    
}

function handleSqlValue (column, value)
{   
    let result = value    

    if (value != undefined || value != null)
    {
        let escapedValue = escapeSpecialCharacters(value)
        switch(column.dataType) {
            case 'tinyint':
                result = convertBoolean(escapedValue)
                break
            default:
                result = '\'' + escapedValue + '\''            
                break
        }
    
    } else {
        result = null
    }
    
    return result
}

function handleJsonValue (value)
{       
    if(value == undefined || value == '')
    {
        return null
    } else {
        return value
    }
}

function escapeSpecialCharacters (value) {
    let result = value.toString()
    if (result != null && result != '') {
        result = result.replace(/'/g, '\'\'')        
    }
    return result
}

function convertBoolean(value) {
    let result = value
    if(value) {
        if(value == true) {
            result = 1
        } else if(value.toUpperCase() == "FALSE" || value.toUpperCase() == "NO") {
            result = 0
        }
    } else {
        result = 0
    }
    return result
}

mapping.getMapping = getMapping
mapping.handleSqlValue = handleSqlValue
mapping.handleJsonValue = handleJsonValue

module.exports = mapping