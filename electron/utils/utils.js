var fs = require('fs');

module.exports.write = function (filePath, data) {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  fs.writeFileSync(filePath, data);
};

module.exports.save = function (name, obj) {

  localStorage.setItem(name, obj);
};
