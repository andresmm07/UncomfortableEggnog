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

// var readAsync = function (filePath, cb) {
//   fs.readFile(filePath, 'utf8', function (err, data) {
//     if (err) {
//       cb(err);
//     } else {
//       cb(null, JSON.parse(data));
//     }
//   })
// };


module.exports.saveCommands = function (obj) {
  console.log('SAVING', obj.rawCommands);
  if (typeof obj === 'object') {
    obj = JSON.stringify(obj);
  }
  save('Commands', obj);
};

module.exports.loadPackage = function (commandsPath) {
  var commandObj = {};
  var rawCommands = lowerCaseProps(JSON.parse(fs.readFileSync(commandsPath, 'utf8')));
  commandObj.rawCommands = rawCommands; // TODO: import core utils
  commandObj.parsedCommands = parseCommands(rawCommands); // { exactCommands: {}, argCommands: {}}
  commandObj.commandsPath = commandsPath;
  commandObj.phrasesPath = commandsPath.replace('commands.', 'phrases.');
  commandObj.phrases = loadPhrases(commandObj.phrasesPath, commandObj.rawCommands);
  prefixTrie.build(Object.keys(commandObj.parsedCommands.argCommands));
  module.exports.saveCommands(commandObj);
};

// module.exports.loadPackageAsync = function (commandsPath, cb) {
//   var commandObj = {};
//   readAsync(commandsPath, function (err, data) {
//     if (err) {
//       cb(err);
//     } else {
//       var rawCommands = data;
//       commandObj.rawCOmmands = rawCommands;
//       commandObj.parsedCommands = parseCommands(rawCommands);
//       commandObj.commandsPath = commandsPath;
//       commandObj.phrasesPath = commandsPath.replace('commands.', 'phrases.');
//       commandObj.phrases = loadPhrases(commandObj.phrasesPath, commandObj.rawCommands);
//       prefixTrie.build(Object.keys(commandObj.parsedCommands.argCommands));
//       module.exports.saveCommands(commandObj);
//       cb(null, commandObj);
//     }
//   })
// };


module.exports.getCommands = function () {
  return get('Commands');
};


// module.exports.addCommand = function (command) {
//   console.log('I GOT A COMMAND FROM THE VIEWS');
//   var newCommandsObj = _.extend({}, module.exports.getCommands());
//   newCommandsObj.rawCommands = lowerCaseProps(_.extend(module.exports.getCommands().rawCommands, command));
//   newCommandsObj.parsedCommands = parseCommands(newCommandsObj.rawCommands);
//   module.exports.saveCommands(newCommandsObj);
//   write(newCommandsObj.commandsPath, newCommandsObj.rawCommands);
//   module.exports.addPhrase(Object.keys(command)[0], Object.keys(command)[0]);
// };
//

module.exports.updateCommands = function (command) {
  console.log('I GOT A COMMAND FROM THE VIEWS');
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
