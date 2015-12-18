var commandsUtil = require('../commandsUtil/commandsUtil');
var executeShellCommand = require('../cmd/execShellCommand');
var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var match = require('../match/match-util').matchUtil;
var listeners = require('./listeners');
var ipcRenderer = require('electron').ipcRenderer;

module.exports = function (event) {
  this.killTimer();
  var transcript = event.results[0][0].transcript;
  var confidence = event.results[0][0].confidence;
  var userCommand = {
    score: confidence,
    term: transcript
  };
  var matchObj = match(userCommand, commandsUtil.getCommands());

  if (matchObj.guessedCommand) {

    //var guessCorrectly = confirm("Did you mean \"" + matchObj.guessedCommand + "\"?");
    executeShellComand("say did you mean" + matchObj.guessedCommand + "?");
    listeners.getListeners().commandRecognition.link(listeners.getListeners().confirmRecognition);
    this.switch();
    ipcRenderer.on('correct', function (event) {
      startCmd.play();

      listeners.getListeners().commandRecognition.link(listeners.getListeners().prefixRecognition);
      commandsUtil.addPhrase(matchObj.guessedCommand, matchObj.userCommand);
      executeShellComand(matchObj.action);
    });
    ipcRenderer.on('incorrect', function (event) {
      listeners.getListeners().commandRecognition.link(listeners.getListeners().prefixRecognition);
      failedCmd.play();
    });
    // if (guessCorrectly) {
    //   startCmd.play();
    //   executeShellComand(matchObj.action);
    //   this.switch();
    //   commandsUtil.addPhrase(matchObj.guessedCommand, matchObj.userCommand);
    // } else {
    //   failedCmd.play();
    //   this.switch();
    // }
  } else if (matchObj.action) {
    startCmd.play();
    executeShellCommand(matchObj.action);
    this.switch();
  } else {
    failedCmd.play();
    this.switch();
  }
};
