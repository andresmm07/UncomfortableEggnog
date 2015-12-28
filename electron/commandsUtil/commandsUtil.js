/*
when jarvis kicks off, he loads the package on load

we read the package contents and shove it in a commandsObj

it goes in commandsObj.packageContents
We do this because we want the user's packages to be separate from our core utils

we create rawCommands which takes the core utils and extends the packageContents
commandsObj.rawCommands.
This will alow us to match all commands. rawCommands contains both the
command and action, regardless of arg

we then the rawCommands and then parse them into arg and exact commands.
This makes parsing arguments easier for us because we can separate an arg into
it's component pieces

commandsObj.parsedCommands
inside the parsedCommands we have argCommands and exactCommands

We then take the path of the commands and the phrases and write them to disk for
persistence.

We have two tries, a prefixTrie that deals with the argCommands and a phraseTrie



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
  console.log('save and write', commandsObj.packageCommands);
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
            cb(null, module.exports.getCommands());
        });
      }
    });
};

module.exports.loadPackage = function (configObj, cb) {
  console.log('load!');
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
  return get('Commands');
};


module.exports.updateCommands = function (commands, cb) {
  var commandsObj = module.exports.getCommands();
  console.log('inside update commands with,', commandsObj);
  var newCommandsObj = updateCommandObj(commands, commandsObj);
  newCommandsObj.phrases = buildPhrases(newCommandsObj.phrases, commands);
  saveAndWrite(newCommandsObj, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log('SAVE AND WRITE CB ', data['packageCommands']);
      cb(null, data['packageCommands']);
    }
  });
};

module.exports.addPhrase = function (correctCommand, userCommand, cb) {
  var commandsObj = module.exports.getCommands();
  addPhrase(commandsObj.phrases, userCommand, correctCommand);
  saveAndWrite(commandsObj, function (err, data) {
    cb();
  });
};
