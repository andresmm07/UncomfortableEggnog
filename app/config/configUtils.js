var fs = require('fs');
var utils = require('../utils/utils');
var _ = require('underscore');

var getConfig = function (cb) {
  fs.readFile(__dirname + '/config.json', 'utf8', function (err, data) {
    if (err) {
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

var saveConfig = function (obj) {
  for (var property in obj) {
    utils.save(property, obj[property]);
  }
};

var writeConfig = function (config, cb) {
  getConfig(function (err, data) {
    data = _.extend(JSON.parse(data), config);
    fs.writeFile(__dirname + '/config.json', JSON.stringify(data), 'utf8', function (err) {
      if (err) {
        cb(err);
      } else {
        saveConfig(data);
        cb(null, data);
      }
    });
  });
};

module.exports = {
  getConfig: getConfig,
  writeConfig: writeConfig,
  saveConfig: saveConfig
};
