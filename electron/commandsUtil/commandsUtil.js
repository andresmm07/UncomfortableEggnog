var matchUtil = require('../match/match-util');
var config = require('../config/config');
var fs = require('fs');
var _ = require('underscore');
var loadPhrases = require('../utils/loaders').loadPhrases;
var prefixTrie = require('../match/prefixTrie');
var save = require('../utils/utils').save;
var write = require('../utils/utils').write;
var parseCommands = require('../match/parseCommands').parseCommands;


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
  var commandObj = {};
  var rawCommands = lowerCaseProps(JSON.parse(fs.readFileSync(commandsPath, 'utf8')));
  // convert all props to lowerCase
  commandObj.rawCommands = rawCommands;
  commandObj.parsedCommands = parseCommands(rawCommands); // { exactCommands: {}, argCommands: {}}
  commandObj.commandsPath = commandsPath;
  commandObj.phrasesPath = commandsPath.replace('commands.', 'phrases.');
  commandObj.phrases = loadPhrases(commandObj.phrasesPath, commandObj.rawCommands);
  prefixTrie.build(Object.keys(commandObj.parsedCommands.argCommands));
  module.exports.saveCommands(commandObj);
};


module.exports.getCommands = function () {
  return get('Commands');
};


module.exports.addCommand = function (command) {
  console.log('I GOT A COMMAND FROM THE VIEWS');
  console.log(command);
  var newCommandsObj = _.extend({}, module.exports.getCommands());
  newCommandsObj.rawCommands = lowerCaseProps(_.extend(module.exports.getCommands().rawCommands, command));
  newCommandsObj.parsedCommands = parseCommands(newCommandsObj.rawCommands);
  module.exports.saveCommands(newCommandsObj);
  console.log(newCommandsObj.commandsPath);
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


module.exports.updateCommand = function (command, action, oldCommand) {
  var commandsObj = module.exports.getCommands();
  if (oldCommand === command) {
    commandsObj.rawCommands[command] = action;
  } else {
    delete commandsObj.rawCommands[oldCommand];
    delete commandsObj.phrases[oldCommand];
    module.exports.addPhrase(command, command);
    commandsObj.rawCommands[command] = action;
  }
  module.exports.saveCommands(commandsObj);
  write(newCommandsObj.commandsPath, newCommandsObj.rawCommands);
};

module.exports.addPhrase = function (correctCommand, userCommand) {
  var commandsObj = module.exports.getCommands();
  commandsObj.phrases[correctCommand] = commandsObj.phrases[correctCommand] || [];
  commandsObj.phrases[correctCommand].push(userCommand);
  module.exports.saveCommands(commandsObj);
  write(commandsObj.phrasesPath, commandsObj.phrases);
};
