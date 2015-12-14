var fs = require('fs');
var natural = require('natural');
var regMatch = require('./regMatch');
var JaroWinklerDistance = natural.JaroWinklerDistance;
var Metaphone = natural.Metaphone;
var formatVariable = require('./formatVariable');


var matching = function (actionPrefix, variable, commandsObj) {
  var actionObj = {};
  actionObj.exact = false;
  actionObj.userCommand = actionPrefix;
  actionObj.guessedCommand = null;
  actionObj.action = '';

  var _actionPrefix = actionPrefix.toLowerCase();
  // var _upperCaseAction = actionPrefix.toUpperCase();
  // var _properCaseAction = actionPrefix[0].toUpperCase() + actionPrefix.slice(1);

  var exactMatchThreshold = 0.8;
  var closeMatchThreshold = 0.6;

  var phrases = commandsObj.phrases;
  var actions = commandsObj.rawCommands; // TODO: change to rawCommands
  var argCommands = commandsObj.parsedCommands.argCommands;
  console.log("INSIDE MATCHING WITH actionPrefix: ", actionPrefix);
  var exactCommands = commandsObj.parsedCommands.exactCommands;

  if (actions[_actionPrefix] !== undefined) {
    console.log('Action exists');
    actionObj.exact = true;
    if (variable && argCommands[_actionPrefix]) {
      console.log("EXACT MATCH FOUND FOR ", _actionPrefix);
      actionObj.action = formatVariable(_actionPrefix, argCommands[_actionPrefix], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[_actionPrefix];
    }
    return actionObj;
  }

  for (var key in phrases) {
    // match within the phrases array
    if (regMatch(phrases[key], _actionPrefix)) {
      console.log('added phrase found');
      actionObj.exact = true;
      // actionObj.action = variable ? actions[key] + formatVariable(variable) : actions[key];
      if (variable && argCommands[_actionPrefix]) {
        actionObj.action = formatVariable(argCommands[_actionPrefix], variable, commandsObj);
      } else {
        actionObj.action = exactCommands[_actionPrefix];
      }
      return actionObj;
    }
    //compare distance between the input phrase and one of our accepted phrase
    if (JaroWinklerDistance(_actionPrefix, key) > exactMatchThreshold) {
      console.log('word distance match found');
      actionObj.exact = false;
      // actionObj.action = variable ? actions[key] + formatVariable(variable) : actions[key];
      if (variable && argCommands[_actionPrefix]) {
        actionObj.action = formatVariable(argCommands[_actionPrefix], variable, commandsObj);
      } else {
        actionObj.action = exactCommands[_actionPrefix];
      }
      return actionObj;
    }
    //first converts the input phrases to the phonetics sound, then compare how far they are apart.
    if (JaroWinklerDistance(Metaphone.process(_actionPrefix), Metaphone.process(key)) > closeMatchThreshold) {
      console.log('phonetic match found');
      actionObj.exact = false;
      actionObj.guessedCommand = key;
      // actionObj.action = variable ? actions[key] + formatVariable(variable) : actions[key];
      if (variable && argCommands[_actionPrefix]) {
        actionObj.action = formatVariable(argCommands[_actionPrefix], variable, commandsObj);
      } else {
        actionObj.action = exactCommands[_actionPrefix];
      }
      return actionObj;
    }
  }

  return actionObj;
};

module.exports = matching;
