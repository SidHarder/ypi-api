var aplicationVersion = {};

var versions = []
//YPI Connect Versions
versions.push({ version: '1.1.10.0', updateAvailable: false, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.9.0', updateAvailable: true, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.8.0', updateAvailable: true, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.7.0', updateAvailable: true, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.6.0', updateAvailable: true, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.5.0', updateAvailable: true, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.4.0', updateAvailable: true, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.3.0', updateAvailable: true, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.2.0', updateAvailable: true, applicationName: 'YPIConnect' });
versions.push({ version: '1.1.1.0', updateAvailable: true, applicationName: 'YPIConnect' });

//YPI LIS Versions
versions.push({ version: '1.0.0.2', updateAvailable: false, applicationName: 'YPILIS' });
versions.push({ version: '1.0.0.1', updateAvailable: false, applicationName: 'YPILIS' });
versions.push({ version: '1.0.0.0', updateAvailable: false, applicationName: 'YPILIS' });

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
  var applicationName = args.applicationName;
  if (!applicationName) {
    return cb(null, { status: 'ERROR', message: `An application name was not provided as an argument.` });
  }

  var version = args.version;
  if (!version) {
    return cb(null, { status: 'ERROR', message: `An version was not provided as an argument.` });
  }

  
  var mappedVersion = versions.find(ver => ver.version === version && ver.applicationName == applicationName );  
  var latestVersion = versions.find(ver => ver.applicationName == applicationName);  

  if(!mappedVersion) {
    cb(null, { status: 'ERROR', message: 'The version provided is not valid.' });
  } else {
    cb(null, { status: 'OK', updateAvailable: mappedVersion.updateAvailable, latestVersion: latestVersion.version });
  }  
}

aplicationVersion.processApplicationVersionOperation = processApplicationVersionOperation;
aplicationVersion.isUpdateAvailable = isUpdateAvailable;
module.exports = aplicationVersion;