var loadPackage = require('../commandsUtil/commandsUtil').loadPackage;
var fs = require('fs');

//write package to the packages folder
var addPackage = function (data, name) {
  var path = 'electron/packages/' + name;
  fs.writeFile(path, data, function (err) {
    if (err) {
      throw err;
    } else {
      loadPackage(path);
    }
  });
};

//read the file from the user's local machine and pass the data to add package to
//create the file
module.exports.uploadPackage = function (path, name) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      throw err;
    } else {
      addPackage(data, name);
    }
  });
};
