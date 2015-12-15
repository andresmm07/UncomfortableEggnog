var fs = require('fs');
var natural = require('natural');
var regMatch = require('./regMatch');
var formatVariable = require('./formatVariable');

var JaroWinklerDistance = natural.JaroWinklerDistance;
var Metaphone = natural.Metaphone;
var soundEx = natural.SoundEx;

soundEx.attach();

module.exports.testPhrases = function (phrases, _actionPrefix) {
  for (var phrasesBucket in phrases) {
    if (regMatch(phrases[phrasesBucket], _actionPrefix)) {
      return phrasesBucket;
    };
  }
  return false;
};

module.exports.JWDTest = function (key, _actionPrefix) {
  return JaroWinklerDistance(key, _actionPrefix);
};

module.exports.phoneticsTest = function (actionPrefix, key) {
  return parseFloat(module.exports.JWDTest(Metaphone.process(key), Metaphone.process(actionPrefix)));
};

module.exports.getMatchByScore = function (phrases, actionPrefix) {
  return phrases.reduce(function (max, phrase) {
    if (max.score === undefined) {
      max.phrase = phrase;
      max.score = module.exports.phoneticsTest(phrase, actionPrefix);
      console.log('\n\n\n\n');
      console.log(phrase + " scored: " + max.score);
      return max;
    } else {
      var score = module.exports.phoneticsTest(phrase, actionPrefix);
      console.log(phrase + " scored: " + score);
      return max.score > score ? max : {
        phrase: phrase,
        score: score
      };
    }
  }, {})['phrase'];
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
  var addedPhraseTest = module.exports.testPhrases(phrases, _actionPrefix);

  if (addedPhraseTest) {
    console.log('added phrase found: ', addedPhraseTest);
    actionObj.exact = true;
    if (variable && argCommands[addedPhraseTest]) {
      actionObj.action = formatVariable(argCommands[addedPhraseTest], variable, commandsObj);
    } else {
      actionObj.action = exactCommands[addedPhraseTest];
    }
  } else {
    var key = module.exports.getMatchByScore(Object.keys(phrases), _actionPrefix);
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

module.exports.matching = matching;
