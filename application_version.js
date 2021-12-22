var aplicationVersion = {};

var versions = []
versions.push({ version: '1.1.10.0', updateAvailable: false });
versions.push({ version: '1.1.9.0', updateAvailable: true });
versions.push({ version: '1.1.8.0', updateAvailable: true });
versions.push({ version: '1.1.7.0', updateAvailable: true });
versions.push({ version: '1.1.6.0', updateAvailable: true });
versions.push({ version: '1.1.5.0', updateAvailable: true });
versions.push({ version: '1.1.4.0', updateAvailable: true });
versions.push({ version: '1.1.3.0', updateAvailable: true });
versions.push({ version: '1.1.2.0', updateAvailable: true });
versions.push({ version: '1.1.1.0', updateAvailable: true });

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
  var mappedVersion = versions.find(ver => ver.version === args.version );  
  if(!mappedVersion) {
    cb(null, { status: 'ERROR', message: 'The version provided is not valid.' });
  } else {
    cb(null, { status: 'OK', updateAvailable: mappedVersion.updateAvailable, latestVersion: versions[0].version });
  }  
}

aplicationVersion.processApplicationVersionOperation = processApplicationVersionOperation;
aplicationVersion.isUpdateAvailable = isUpdateAvailable;
module.exports = aplicationVersion;