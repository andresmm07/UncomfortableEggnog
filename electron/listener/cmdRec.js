var commandsUtil = require('../commandsUtil/commandsUtil');
var executeShellCommand = require('../cmd/execShellCommand');
var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var match = require('../match/match-util').matchUtil;
var listener = require('./listener');
var phoneticsTest = require('../match/testers/phoneticsTest');
var matchObj;

module.exports = function (event) {
  this.killTimer();
  var transcript = event.results[0][0].transcript;
  var confidence = event.results[0][0].confidence;
  var userCommand = {
    score: confidence,
    term: transcript
  };
  matchObj = match(userCommand, commandsUtil.getCommands());

  // If there is an action, that means we have an exact match
  if (matchObj.action && !matchObj.guessedCommand) {
    startCmd.play();
    executeShellCommand(matchObj.action);
    this.switch();
  } else if (matchObj.guessedCommand) {
    executeShellCommand("say did you mean" + matchObj.guessedCommand + "?");
    this.pause();

    // confirmListener is why I love javascript.
    // By keeping this function within this scope,
    // it retains access to the commandsUtils object,
    // the matchObj and the executeShellCommand function.

    // we can switch the current context by binding the callback
    // to the current context
    var confirmListener = listener(function (event) {
      confirmListener.pause();
      confirmListener.killTimer();
      var word = event.results[0][0].transcript;
      if (phoneticsTest(word, 'Yes') > 0.6) {
        // addPhrase adds a phrase and calls saveAndWrite
        commandsUtil.addPhrase(
          matchObj.guessedCommand,
          matchObj.userCommand,
          function () {
            startCmd.play();
            executeShellCommand(matchObj.action);
            console.log('inside addPhrase callback', this.name);
            this.switch();
        }.bind(this));

      } else {
        console.log('cmd just failed to match');
        failedCmd.play();
        this.switch();
      }
    }.bind(this), 'confirm', 5000);
    confirmListener.start();

  } else {
    startCmd.play();
    this.switch();
  }
};
