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
var matchUtil = require('../match/match-util');
var config = require('../config/config');
var fs = require('fs');
var _ = require('underscore');
var loadPhrases = require('../utils/loaders').loadPhrases;
var prefixTrie = require('../match/prefixTrie');
var get = require('../utils/utils').get;
var lowerCaseProps = require('../utils/utils').lowerCaseProps;
var PhraseTrie = require('../utils/phraseTrie').PhraseTrie;
var addPhrase = require('../utils/phraseTrie').addPhrase;
var parseCommands = require('../match/parseCommands').parseCommands;
var coreUtils = require('../packages/core-utils');
var saveCommands = require('../utils/utils').saveCommands;

/*
  takes an existing commandObj or builds a new one
  takes the package, and extends it
*/

var updateCommandObj = function (packageObj, commandObj) {
  commandObj = commandObj || {};
  commandObj.packageCommands = lowerCaseProps(packageObj);
  commandObj.rawCommands = _.defaults(coreUtils, packageObj);
  commandObj.parsedCommands = parseCommands(commandObj.rawCommands);
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

/*
  A not very pure function, but essentially it takes advantange of
  JS's passing objects by reference, and adds the commands one by one
  into the datastructure. Because its by reference, we can then return
  the original object and it will be updated.

  Doing this because I'm not good at cs.
*/

var buildPhrases = function (phrases, commands) {
  for (var command in commands) {
    addPhrase(phrases, command, command);
  }
  return phrases;
};
/*
  Saves the command object in localStorage and then fs.writeFiles it.
*/

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
            console.log(commandsObj);
            cb(null, commandsObj);
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
          console.log(data);
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

/*



*/

module.exports.updateCommands = function (commands, cb) {
  var commandsObj = module.exports.getCommands();
  console.log('inside update commands with,', commandsObj);
  var newCommandsObj = updateCommandObj(commands, commandsObj);
  newCommandsObj.phrases = buildPhrases(newCommandsObj.phrases, commands);
  saveAndWrite(newCommandsObj, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      cb(null, data);
    }
  });
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
