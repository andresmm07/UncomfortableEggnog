// Paths to find the commands.json, language type, etc.
var fs = require('fs');
var utils = require('../utils/utils');

module.exports = {
  phrasesPath: __dirname + '/../packages/newphrases.json',
  commandsPath: __dirname + '/../packages/newcommands.json'
};

var get = function (cb) {
  fs.readFile('./electron/config/config.json', function (err, data) {
    if (err) {
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

var write = function (property, value, cb) {
  get(function (err, data) {
    data[property] = value;
    fs.writeFile('./electron/config/config.json', data, function (err) {
      if (err) {
        cb(err);
      } else {
        utils.save(property, value);
        cb(null, data);
      }
    });
  });
};