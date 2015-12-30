var fs = require('fs');
var utils = require('../utils/utils');
var _ = require('underscore');
var path = require('path');
var configPath = path.resolve('./app/configCTRL/') + '/config.json';

var getConfig = function (cb) {
  fs.readFile(configPath, 'utf8', function (err, data) {
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
    if (err) {
      console.log(err);
      cb(err);
    } else {
      data = _.extend(JSON.parse(data), config);
      fs.writeFile(configPath, JSON.stringify(data), 'utf8', function (err) {
        if (err) {
          cb(err);
        } else {
          saveConfig(data);
          cb(null, data);
        }
      });
    }
  });
};

module.exports = {
  getConfig: getConfig,
  writeConfig: writeConfig,
  saveConfig: saveConfig
};
