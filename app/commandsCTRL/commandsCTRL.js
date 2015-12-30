/*
  commandsUtil creates the object where command and phrases are defined
*/

var fs = require('fs');
var updateCommandObj = require('./updateCommands');
var initPhrases = require('./phrases').initPhrases;
var buildPhrases = require('./phrases').buildPhrases;
var buildCommands = require('./buildCommands');
var getCommands = require('../utils/utils').getCommands;
var saveAndWrite = require('./saveAndWrite');
var addPhrase = require('../utils/phraseTrie').addPhrase;
var rootPath = (function () {return __dirname; })();


/*
  Saves the command object in localStorage and then fs.writeFiles it.
*/


module.exports.loadPackage = function (configObj, cb) {
  configObj.commandsPath = rootPath + configObj.commandsPath;
  var commandsPath = configObj.commandsPath;
  buildCommands(commandsPath, function (err, commandsObj) {
    console.log(commandsObj);
    if (err) {
      cb(err);
    } else {
      initPhrases(commandsObj, function (err, commandsObj) {
        saveAndWrite(commandsObj, function (err, data) {
          if (err) {
            cb(err);
          } else {
            cb(null, data);
          }
        });
      });
    }
  });
};

module.exports.updateCommands = function (commands, cb) {
  var commandsObj = getCommands();
  var newCommandsObj = updateCommandObj(commands, commandsObj);
  newCommandsObj.phrases = buildPhrases(newCommandsObj.phrases, commands);
  saveAndWrite(newCommandsObj, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      cb(null, data['packageCommands']);
    }
  });
};

module.exports.addPhrase = function (correctCommand, userCommand, cb) {
  var commandsObj = getCommands();
  addPhrase(commandsObj.phrases, userCommand, correctCommand);
  saveAndWrite(commandsObj, function (err, data) {
    cb();
  });
};
