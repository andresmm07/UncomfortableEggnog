var fs = require('fs');
var natural = require('natural');
var regMatch = require('./regMatch');
var formatVariable = require('./formatVariable');

var JaroWinklerDistance = natural.JaroWinklerDistance;
var Metaphone = natural.Metaphone;
var soundEx = natural.SoundEx;

soundEx.attach();

module.exports.testPhrases = function (phrases, _actionPrefix) {
  return regMatch(phrases, _actionPrefix);
};
module.exports.JWDTest = function (key, _actionPrefix) {
  return JaroWinklerDistance(key, _actionPrefix);
};
module.exports.phoneticsTest = function (actionPrefix, key) {
  console.log(Metaphone.process(key));
  console.log(Metaphone.process(actionPrefix));
  return module.exports.JWDTest(Metaphone.process(key), Metaphone.process(actionPrefix));
};


var matching = function (actionPrefix, variable, commandsObj) {
  var _actionPrefix = actionPrefix.toLowerCase();
  var actionObj = {};
  actionObj.exact = false;
  actionObj.userCommand = actionPrefix;
  actionObj.guessedCommand = null;
  actionObj.action = '';

  var exactMatchThreshold = 0.8;
  var closeMatchThreshold = 0.6;

  var phrases = commandsObj.phrases;
  var actions = commandsObj.rawCommands; // TODO: change to rawCommands
  var argCommands = commandsObj.parsedCommands.argCommands;
  var exactCommands = commandsObj.parsedCommands.exactCommands;

  if (actions[_actionPrefix] !== undefined) {
    console.log('Action exists');
    actionObj.exact = true;
    if (variable && argCommands[_actionPrefix]) {
      actionObj.action = formatVariable(_actionPrefix, argCommands[_actionPrefix], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[_actionPrefix];
    }
    return actionObj;
  }


  for (var key in phrases) {

    if (module.exports.testPhrases(phrases[key], _actionPrefix)) {
      console.log('added phrase found');
      actionObj.exact = true;
      if (variable && argCommands[_actionPrefix]) {
        actionObj.action = formatVariable(argCommands[key], variable, commandsObj);
      } else {
        actionObj.action = exactCommands[key];
      }
      return actionObj;
    }

    if (module.exports.JWDTest(_actionPrefix, key) > exactMatchThreshold) {
      actionObj.exact = false;
      if (variable && argCommands[key]) {
        actionObj.action = formatVariable(argCommands[key], variable, commandsObj);
      } else {
        actionObj.action = exactCommands[key];
      }
      return actionObj;
    }

    if (module.exports.phoneticsTest(_actionPrefix, key) > closeMatchThreshold) {
      console.log('phonetic match found');
      actionObj.exact = false;
      actionObj.guessedCommand = key;
      if (variable && argCommands[key]) {
        actionObj.action = formatVariable(argCommands[key], variable, commandsObj);
      } else {
        actionObj.action = exactCommands[key];
      }
      return actionObj;
    }
  }

  return actionObj;
};

module.exports.matching = matching;
