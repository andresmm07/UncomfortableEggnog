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
var parseCommands = require('../match/parseCommands').parseCommands;
var coreUtils = require('../packages/core-utils');

module.exports.saveCommands = function (obj) {
  console.log('SAVING', obj.rawCommands);
  if (typeof obj === 'object') {
    obj = JSON.stringify(obj);
  }
  save('Commands', obj);
};

module.exports.getCommands = function () {
  return get('Commands');
};

module.exports.loadPackage = function (commandsPath) {
  var commandObj = {};
  var rawCommands = lowerCaseProps(JSON.parse(fs.readFileSync(commandsPath, 'utf8')));
  // TODO: hide coreutils, don't overwrite new packages
  commandObj.rawCommands = _.defaults(coreUtils, rawCommands);
  commandObj.parsedCommands = parseCommands(rawCommands); // { exactCommands: {}, argCommands: {}}
  commandObj.commandsPath = commandsPath;
  commandObj.phrasesPath = commandsPath.replace('commands.', 'phrases.');
  commandObj.phrases = loadPhrases(commandObj.phrasesPath, commandObj.rawCommands);
  prefixTrie.build(Object.keys(commandObj.parsedCommands.argCommands));
  module.exports.saveCommands(commandObj);
};

module.exports.updateCommands = function (command) {
  var newCommandsObj = _.extend({}, module.exports.getCommands());
  newCommandsObj.rawCommands = lowerCaseProps(command);
  newCommandsObj.parsedCommands = parseCommands(newCommandsObj.rawCommands);
  module.exports.saveCommands(newCommandsObj);
  write(newCommandsObj.commandsPath, newCommandsObj.rawCommands);
  module.exports.addPhrase(Object.keys(command)[0], Object.keys(command)[0]);
};


module.exports.delCommand = function (command) {
  var commandsObj = module.exports.getCommands();
  delete commandsObj.rawCommands[command];
  delete commandsObj.phrases[command];
  module.exports.saveCommands(commandsObj);
  write(commandsObj.commandsPath, commandsObj.rawCommands);
  write(commandsObj.phrasesPath, commandsObj.phrases);
};

module.exports.addPhrase = function (correctCommand, userCommand) {
  var commandsObj = module.exports.getCommands();
  commandsObj.phrases[correctCommand] = commandsObj.phrases[correctCommand] || [];
  commandsObj.phrases[correctCommand].push(userCommand);
  module.exports.saveCommands(commandsObj);
  write(commandsObj.phrasesPath, commandsObj.phrases);
};
