var fs = require('fs');
var natural = require('natural');
var formatVariable = require('./formatVariable');
var testPhrases = require('./testers/testPhrases');
var getMatchByScore = require('./testers/getMatchByScore');
var phoneticsTest = require('./testers/phoneticsTest');
var JWDTest = require('./testers/JWDTest');
var findCommand = require('../utils/phraseTrie').findCommand;
var utils = require('../utils/utils');



module.exports = function (actionPrefix, variable, commandsObj) {
  var _actionPrefix = actionPrefix.toLowerCase();
  var actionObj = {};
  actionObj.exact = false;
  actionObj.userCommand = actionPrefix;
  actionObj.guessedCommand = null;
  actionObj.action = '';
  /*
    Mocking localStorage when in test env.
  */
  if (process.env.NODE_ENV !== 'test') {
    var exactMatchThreshold = parseFloat(utils.get('exactMatchThreshold'));
    var closeMatchThreshold = parseFloat(utils.get('closeMatchThreshold'));
  } else {
    console.log('test');
    var exactMatchThreshold = 0.8;
    var closeMatchThreshold = 0.65;
  }

  /*
    Destructuring the commandsObj
  */
  var phrases = commandsObj.phrases;
  var actions = commandsObj.rawCommands;
  var argCommands = commandsObj.parsedCommands.argCommands;
  var exactCommands = commandsObj.parsedCommands.exactCommands;
  var testPhrase = testPhrases(actions, _actionPrefix);

  if (actions[_actionPrefix] !== undefined || actions[testPhrase]) {
    actionObj.exact = true;
    if (variable && argCommands[_actionPrefix]) {
      actionObj.action = formatVariable(_actionPrefix, argCommands[_actionPrefix], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[_actionPrefix];
    }
    return actionObj;
  }

  var addedPhraseTest = findCommand(phrases, _actionPrefix);

  if (addedPhraseTest) {
    actionObj.exact = true;

    if (variable && argCommands[addedPhraseTest]) {
      actionObj.action = formatVariable(argCommands[addedPhraseTest], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[addedPhraseTest];
    }

  } else {
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
