var fs = require('fs');
var natural = require('natural');
var formatVariable = require('./formatVariable');
var testPhrases = require('./testers/testPhrases');
var getMatchByScore = require('./testers/getMatchByScore');
var phoneticsTest = require('./testers/phoneticsTest');
var JWDTest = require('./testers/JWDTest');

var exactMatchThreshold = 0.8;
var closeMatchThreshold = 0.6;

module.exports = function (actionPrefix, variable, commandsObj) {
  var _actionPrefix = actionPrefix.toLowerCase();
  var actionObj = {};
  actionObj.exact = false;
  actionObj.userCommand = actionPrefix;
  actionObj.guessedCommand = null;
  actionObj.action = '';


  var phrases = commandsObj.phrases;
  var actions = commandsObj.rawCommands;
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

  var addedPhraseTest = testPhrases(phrases, _actionPrefix);
  if (addedPhraseTest) {
    console.log('added phrase found: ', addedPhraseTest);
    actionObj.exact = true;
    if (variable && argCommands[addedPhraseTest]) {
      actionObj.action = formatVariable(argCommands[addedPhraseTest], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[addedPhraseTest];
    }
  } else {
    var key = getMatchByScore(Object.keys(actions), _actionPrefix);
    console.log('guessing ' + key);
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
