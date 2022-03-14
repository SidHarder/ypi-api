var fs = require('fs');
var path = require('path');

const moment = require('moment');

var fileStructure = {};
var rootFolder = process.env.ACCESSION_DOCUMENT_PATH;

function addCaseFolders (args, cb) {
  var nextYear = args.nextYear;
  if (nextYear == undefined) {
    console.log(`The nextYear argument was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `The nextYear argument was not provided as an argument.` });
  }

  var qtyInThousands = args.qtyInThousands;
  if (!qtyInThousands) {
    console.log(`The qtyInThousands argument was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `The qtyInThousands argument was not provided as an argument.` });
  }

  var year = moment().format('YYYY');
  if (nextYear == true) year = moment.add(1, 'year').format('YYYY');

  for(var i=1000; i<qtyInThousands*1000; i+=1000) {
    var filePath = path.join(rootFolder, year, `${ i.toString().padStart(5, 0) }-${(i + 999).toString().padStart(5, 0)}`);
    if (!fs.existsSync(filePath)) {
      for(var j=i; j<=i + 999; j++) {
        var maFilePath = path.join(filePath, `21-${j.toString()}`)        
        fs.mkdirSync(maFilePath, { recursive: true });
      }      
    }
  }  

  cb(null, { status: 'OK', message: 'The folders have been created.' })
}

function getCasePath(args, cb) {
  var masterAccessionNo = args.masterAccessionNo;
  if (masterAccessionNo == undefined) {
    console.log(`The masterAccessionNo argument was not provided as an argument.`);
    return cb(null, { status: 'ERROR', message: `The masterAccessionNo argument was not provided as an argument.` });
  }

  var thousandNos = [
    { start: 1, end: 999, path: '00001-00999' }    
  ];

  for(var i=1000; i<10000; i=i+100000 ) {    
    thousandNos.push({ start: i, end: i+999, path: `${i.toString().padStart(5, '0')}-${(i + 999).toString().padStart(5, '0')}` })
  }

  var dashSplit = masterAccessionNo.split('-');
  var year = `20${dashSplit[0]}`;
  var number = Number(dashSplit[1]);  
  var thousandNo = thousandNos.find(i => number >= i.start && number <= i.end);
  var filePath = path.join(rootFolder, year, thousandNo.path, masterAccessionNo )

  cb(null, { status: 'OK', casePath: filePath })
}

fileStructure.getCasePath = getCasePath;
fileStructure.addCaseFolders = addCaseFolders;
module.exports = fileStructure;
