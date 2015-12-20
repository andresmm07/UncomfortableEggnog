var matchUtil = require('../match/match-util');
var config = require('../config/config');
var fs = require('fs');
var _ = require('underscore');
var loadPhrases = require('../utils/loaders').loadPhrases;
var prefixTrie = require('../match/prefixTrie');
var save = require('../utils/utils').save;
var write = require('../utils/utils').write;
var get = require('../utils/utils').get;
var lowerCaseProps = require('../utils/utils').lowerCaseProps;
var PhraseTrie = require('../utils/phraseTrie').PhraseTrie;
var addPhrase = require('../utils/phraseTrie').addPhrase;
var parseCommands = require('../match/parseCommands').parseCommands;
var coreUtils = require('../packages/core-utils');



var get = function (name) {
  return JSON.parse(localStorage.getItem(name));
};

var lowerCaseProps = function (obj) {
  var newObj = {};
  for (var key in obj) {
    newObj[key.toLowerCase()] = obj[key];
  }
  return newObj;
};

var saveCommands = function (obj) {
  if (typeof obj === 'object') {
    obj = JSON.stringify(obj);
  }
  save('Commands', obj);
};

/*
  when jarvis kicks off, he loads the package on load

  we read the package contents and shove it in a commandsObj

  it goes in commandsObj.packageContents

  we create rawCommands which takes the core commands and extends the packageContents
  call this
  commandsObj.rawCommands

  rawCommands contains both the command and action, regardless of arg

  we then the rawCommands and then parse them into arg and exact commands

  call this
  commandsObj.parsedCommands
    inside the parsedCommands we have argCommands and exactCommands

  we then take the path of the commands and the phrases and build jsons for both
  this SHOULD BE ASYNC.

  We then have two tries, a prefixTrie that deals with the argCommands and a phraseTrie

  the phraseTrie should have outside methods that manipulate it.

*/

var updateCommandObj = function (packageObj, commandObj) {
  commandObj = commandObj || {};
  commandObj.packageCommands = lowerCaseProps(packageObj);
  commandObj.rawCommands = _.defaults(coreUtils, packageObj);
  commandObj.parsedCommands = parseCommands(commandObj.rawCommands);
  console.log(commandObj);
  return commandObj;
};

var buildCommands = function (commandPath, callback) {
  console.log('buildCommands');
  fs.readFile(commandPath, 'utf8', function (err, packageObj) {
    if (err) {
      callback(err);
    } else {
      var commandObj = updateCommandObj(JSON.parse(packageObj));
      commandObj.commandPath = commandPath;
      commandObj.phrasesPath = commandPath.replace('commands.', 'phrases.');
      callback(null, commandObj);
    }
  });
};

var initPhrases = function (rawCommands) {
  console.log('initPhrases');
  var commands = Object.keys(rawCommands);
  var initTrie = PhraseTrie();
  for (var i = 0; i < commands.length; i++) {
    addPhrase(initTrie, commands[i], commands[i]);
  }
  return initTrie;
};

var saveAndWrite = function (commandsObj, cb) {
  console.log(commandsObj.packageCommands);
  saveCommands(commandsObj);
  fs.writeFile(
    commandsObj.commandPath,
    JSON.stringify(commandsObj.packageCommands),
    'utf8',
    function (err, data) {
      if (err) {
        cb(err);
      } else {
        fs.writeFile(
          commandsObj.phrasesPath,
          JSON.stringify(commandsObj.phrases),
          'utf8',
          function (err, data) {
            cb(null, data);
        });
      }
    });
};

module.exports.loadPackage = function (configObj, cb) {
  var commandsPath = configObj.commandsPath;
  buildCommands(commandsPath, function (err, commandsObj) {
    if (err) {
      cb(err);
    } else {
      commandsObj.phrases = initPhrases(commandsObj.rawCommands);
      saveAndWrite(commandsObj, function (err, data) {
        if (err) {
          cb(err);
        } else {
          cb(null, data);
        }
      });
    }
  });
};


module.exports.getCommands = function () {
  var commandsObj = get('Commands');
  return commandsObj;
};

module.exports.updateCommands = function (commands, cb) {
  var commandsObj = module.exports.getCommands();
  var newCommandsObj = updateCommandObj(commands, commandsObj);
  module.exports.saveCommands(newCommandsObj);
  write(newCommandsObj.commandsPath, newCommandsObj.packageCommands);
  module.exports.addPhrase(Object.keys(commands)[0], Object.keys(commands)[0]);
  cb(newCommandsObj.packageCommands);
};

module.exports.delCommand = function (command, cb) {
  var commandsObj = module.exports.getCommands();
  delete commandsObj.packageCommands[command];
  module.exports.saveCommands(commandsObj);
  write(commandsObj.commandsPath, commandsObj.packageCommands);
  write(commandsObj.phrasesPath, commandsObj.phrases);
  cb(commandsObj.packageCommands);
};

module.exports.addPhrase = function (correctCommand, userCommand, cb) {
  var commandsObj = module.exports.getCommands();
  addPhrase(commandsObj.phrases, userCommand, correctCommand);
  saveAndWrite(commandsObj, function (err, data) {
    cb();
  });
};
