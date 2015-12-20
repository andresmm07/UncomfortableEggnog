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
var objToTrie = require('../utils/phraseTrie').objToTrie;
var parseCommands = require('../match/parseCommands').parseCommands;
var coreUtils = require('../packages/core-utils');

var updateCommandObj = function (packageObj, commandObj) {
  commandObj = commandObj || {};
  commandObj.packageCommands = lowerCaseProps(packageObj);
  commandObj.rawCommands = _.defaults(coreUtils, packageObj);
  commandObj.parsedCommands = parseCommands(commandObj.rawCommands);
  return commandObj;
};


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

module.exports.saveCommands = function (obj) {
  if (typeof obj === 'object') {
    obj = JSON.stringify(obj);
  }
  save('Commands', obj);
};

module.exports.loadPackage = function (commandsPath) {
  var packageCommands = JSON.parse(fs.readFileSync(commandsPath, 'utf8'));
  var commandObj = updateCommandObj(packageCommands);
  commandObj.commandsPath = commandsPath;
  commandObj.phrasesPath = commandsPath.replace('commands.', 'phrases.');
  commandObj.phrases = loadPhrases(commandObj.phrasesPath, commandObj.rawCommands);
  prefixTrie.build(Object.keys(commandObj.parsedCommands.argCommands));
  module.exports.saveCommands(commandObj);
  return commandObj;
};


module.exports.getCommands = function () {
  var commandsObj = get('Commands');
  commandsObj.phrases = objToTrie(commandsObj.phrases);
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
  // TODO: traverse trie
  // commandsObj.phrases = objToTrie(commandsObj.phrases);
  // commandsObj.phrases.removeCommand(command);
  module.exports.saveCommands(commandsObj);
  write(commandsObj.commandsPath, commandsObj.packageCommands);
  write(commandsObj.phrasesPath, commandsObj.phrases);
  cb(commandsObj.packageCommands);
};

module.exports.addPhrase = function (correctCommand, userCommand) {
  var commandsObj = module.exports.getCommands();
  commandsObj.phrases = objToTrie(commandsObj.phrases);
  commandsObj.phrases.addPhrase(userCommand, correctCommand);
  module.exports.saveCommands(commandsObj);
  write(commandsObj.phrasesPath, commandsObj.phrases);
};
