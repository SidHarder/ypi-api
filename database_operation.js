const mysql = require('mysql')
const localSettings = require('./local_settings.json')
const mapping = require('./mapping')

const databaseOperation = {}

var pool = mysql.createPool({
  host: localSettings.mySql.host,
  user: localSettings.mySql.user,
  password: localSettings.mySql.password,
  database: localSettings.mySql.database,
  multipleStatements: localSettings.mySql.multipleStatements,
  dateStrings: ['DATE', 'DATETIME']
})

function processDatabaseOperation(args, cb) {
  switch (args[0].databaseOperation.method) {
    case 'executeSqlCommand':
      executeSqlCommand(args[0].databaseOperation.commandText, cb)
      break
    case 'insertRow':
      insertRow(args, cb)
      break
    case 'updateRow':
      updateRow(args, cb)
      break
    default:
      cb(null, { status: 'ERROR', message: 'Method Not Found.' })
      break
  }
}

function query() {
  var queryArgs = Array.prototype.slice.call(arguments)
  var events = []
  var eventNameIndex = {}

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
      return this
    }
  }
}

function executeSqlCommand(commandText, cb) {
  query(commandText, function (error, results, fields) {
    if (error) {
      console.error(error)
      return cb(null, { status: 'ERROR', message: error })
    }
    return cb(null, { status: 'OK', message: 'Success.', queryResult: results })
  })
}

function insertRow(tableName, row, cb) {
  mapping.getMapping(tableName, function (error, tableMapping) {
    if (error) return cb(null, { status: 'ERROR', message: error })
    var sql = 'Insert ' + tableName
    var fields = []
    var values = []

    tableMapping.forEach(function (column, index) {
      if (row[column.camelCase] != undefined) {
        fields.push(column.columnName)
        values.push(mapping.handleSqlValue(column, row[column.camelCase]))
      }
    })

    sql += ' (' + fields.join(', ') + ') values (' + values.join(', ') + ')'

    databaseOperation.executeSqlCommand(sql, function (error, result) {
      if (error) return cb(error)
      cb(null, { status: 'OK', message: 'The order was inserted successfully.' })
    })
  })
}

function updateRow(tableName, row, cb) {
  mapping.getMapping(tableName, function (error, tableMapping) {
    if (error) return cb(null, { status: 'ERROR', message: error })
    var sql = 'Update ' + tableName + ' set '
    var sqlWhere = 'Where '

    tableMapping.forEach(function (column, index) {
      if (row[column.camelCase] != null) {
        if (column.columnKey != 'PRI') {
          sql += column.columnName + ' = ' + mapping.handleSqlValue(column, row[column.camelCase]) + ', '
        } else {
          sqlWhere = sqlWhere + column.columnName + ` = '${row[column.camelCase]}'`
        }
      }
    })

    sql = sql.substring(0, sql.length - 2)
    sql = sql + ' ' + sqlWhere

    databaseOperation.executeSqlCommand(sql, function (error, result) {
      if (error) return cb(error)
      cb(null, { status: 'OK', message: 'The order was updated successfully.' })
    })
  })
}

databaseOperation.executeSqlCommand = executeSqlCommand
databaseOperation.processDatabaseOperation = processDatabaseOperation
module.exports = databaseOperation
