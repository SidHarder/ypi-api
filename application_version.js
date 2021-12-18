var aplicationVersion = {};

const applicationVersionMapp = [
  { target: 'applicationVersion', method: 'isUpdateAvailable', mappedMethod: isUpdateAvailable }
];

function processApplicationVersionOperation(args, cb) {
  var map = applicationVersionMapp.find((r) => r.target == args[0].applicationVersionOperation.target && r.method == args[0].applicationVersionOperation.method);
  if (map) {
    map.mappedMethod(args[0].applicationVersionOperation, cb);
  } else {
    console.error('applicationVersionOperation.processApplicationVersionOperation: Target/Method Not Found')
    cb(null, { status: 'ERROR', message: `Target/Method Not Found` });
  }
}

function isUpdateAvailable(args, cb) {
  cb(null, { status: 'OK', latestVersion: '1.0.0.1' })
}

aplicationVersion.processApplicationVersionOperation = processApplicationVersionOperation;
aplicationVersion.isUpdateAvailable = isUpdateAvailable;
module.exports = aplicationVersion;