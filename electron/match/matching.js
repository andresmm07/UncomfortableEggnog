var fs = require('fs');
var natural = require('natural');
var formatVariable = require('./formatVariable');
var testPhrases = require('./testers/testPhrases');
var getMatchByScore = require('./testers/getMatchByScore');
var phoneticsTest = require('./testers/phoneticsTest');
var JWDTest = require('./testers/JWDTest');



module.exports = function (actionPrefix, variable, commandsObj) {
  var _actionPrefix = actionPrefix.toLowerCase();
  var actionObj = {};
  actionObj.exact = false;
  actionObj.userCommand = actionPrefix;
  actionObj.guessedCommand = null;
  actionObj.action = '';

  var exactMatchThreshold = 0.8;
  var closeMatchThreshold = 0.65;

  var phrases = commandsObj.phrases;
  var actions = commandsObj.rawCommands;
  var argCommands = commandsObj.parsedCommands.argCommands;
  var exactCommands = commandsObj.parsedCommands.exactCommands;

  if (actions[_actionPrefix] !== undefined) {
    actionObj.exact = true;
    if (variable && argCommands[_actionPrefix]) {
      actionObj.action = formatVariable(_actionPrefix, argCommands[_actionPrefix], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[_actionPrefix];
    }
    return actionObj;
  }
  // change to trie
  // var addedPhraseTest = testPhrases(phrases, _actionPrefix);
  var addedPhraseTest = phrases.findCommand(_actionPrefix);

  if (addedPhraseTest) {
    actionObj.exact = true;

    if (variable && argCommands[addedPhraseTest]) {
      actionObj.action = formatVariable(argCommands[addedPhraseTest], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[addedPhraseTest];
    }

  } else {
    // only execute if score is above threshold
    var key = getMatchByScore(Object.keys(actions), _actionPrefix);
    actionObj.exact = false;
    actionObj.guessedCommand = key;

    if (variable && argCommands[key]) {
      actionObj.action = formatVariable(argCommands[key], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[key];
    }

  }
  return actionObj;
};
