const moment = require('moment')
const jayson = require('jayson')

const authenticationRequest = require('./authentication_request')

const port = 3000

const server = jayson.server({
  ping: ping,
  authenticationRequest: authenticationRequest.processAuthenticationRequest
})

function ping (args, cb) {
    console.log('Ping received .. sending pong response.')
    cb(null, { status: 'OK', message: 'Pong' })
}


server.http().listen(port, function () {
  console.log('Server is listening on port: ' + port)
})