const mysql = require('mysql')
const localSettings = require('./local_settings.json')
const mapping = require('./mapping')

const db = {}

var pool = mysql.createPool({
    host: localSettings.mySql.host,
    user: localSettings.mySql.user,
    password: localSettings.mySql.password,
    database: localSettings.mySql.database,
    multipleStatements: localSettings.mySql.multipleStatements,
    dateStrings: ['DATE', 'DATETIME']
})

function query() {
    var queryArgs = Array.prototype.slice.call(arguments),
        events = [],
        eventNameIndex = {}

    pool.getConnection(function (err, conn) {
        if (err) {
            console.log(err)
            if (eventNameIndex.error) {
                eventNameIndex.error()
            }
        }
        if (conn) { 
            var q = conn.query.apply(conn, queryArgs)
            q.on('end', function () {
                conn.release()
            })

            events.forEach(function (args) {
                q.on.apply(q, args)
            })
        }
    })

    return {
        on: function (eventName, callback) {
            events.push(Array.prototype.slice.call(arguments))
            eventNameIndex[eventName] = callback
            return this;
        }
    }
}

function handleSqlCommand(params, cb) {
    executeSqlCommand(params[0].commandText, function (err, result) {        
        if (err) return cb(err)
        return cb(null, result)
    })
}

function executeSqlCommand(sql, cb) {
    query(sql, function (error, results, fields) {
        if (error) {
            console.error(error)
            return cb(null, { status: 'ERROR', 'message': error })
        }        
        return cb(null, { status: 'OK', 'message': 'Success.', queryResult: results })
    })
}

function insertRow(tableName, row, cb) {    
    mapping.getMapping(tableName, function (error, tableMapping) {
        var sql = 'Insert ' + tableName
        var fields = []
        var values = []
        
        tableMapping.forEach(function (column, index) {               
            if(row[column.camelCase] != undefined)
            {                           
                fields.push(column.columnName)                
                values.push(mapping.handleSqlValue(column, row[column.camelCase]))
            }        
        })                
        
        sql += ' (' + fields.join(', ') + ') values (' + values.join(', ') + ')'            

        db.executeSqlCommand(sql, function (error, result) {            
            if (error) return cb(error)
            cb(null, { status: 'OK', message: 'The order was inserted successfully.' })
        })
    })
}

function updateRow(tableName, row, cb) {    
    mapping.getMapping(tableName, function (error, tableMapping) {
        var sql = 'Update ' + tableName + ' set '        
        var sqlWhere = 'Where '
        
        tableMapping.forEach(function (column, index) {               
            if(row[column.camelCase] != null)
            {
                if (column.columnKey != 'PRI') {
                    sql += column.columnName + ' = ' + mapping.handleSqlValue(column, row[column.camelCase]) + ', '                
                } else {                    
                    sqlWhere = sqlWhere + column.columnName + ' = \'' + row[column.camelCase] + '\''
                }
            }            
        })                

        sql = sql.substring(0, sql.length - 2)
        sql = sql + ' ' + sqlWhere
        
        db.executeSqlCommand(sql, function (error, result) {            
            if (error) return cb(error)
            cb(null, { status: 'OK', message: 'The order was updated successfully.' })
        })
    })
}

db.executeSqlCommand = executeSqlCommand
db.handleSqlCommand = handleSqlCommand
db.insertRow = insertRow
db.updateRow = updateRow

module.exports = db