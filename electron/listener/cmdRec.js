var commandsUtil = require('../commandsUtil/commandsUtil');
var executeShellCommand = require('../cmd/execShellCommand');
var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var match = require('../match/match-util').matchUtil;
var listeners = require('./listeners');
var ipcRenderer = require('electron').ipcRenderer;

var matchObj;

module.exports = function (event) {
  this.killTimer();
  var transcript = event.results[0][0].transcript;
  var confidence = event.results[0][0].confidence;
  var userCommand = {
    score: confidence,
    term: transcript
  };


  console.log("Match Object: ", matchObj);
  // if (!matchObj.exact) {
  //   this.link(listeners.getListeners().confirmRecognition);
  //   this.switch();
  //   executeShellCommand("say did you mean" + matchObj.guessedCommand + "?");
  //   // currentWebContent.send("match", matchObj);
  // } else if (matchObj.exact) {

  matchObj = match(userCommand, commandsUtil.getCommands());

  if (matchObj.guessedCommand) {
    executeShellCommand("say did you mean" + matchObj.guessedCommand + "?");
    this.link(listeners.getListeners().confirmRecognition);
    this.switch();
  } else if (matchObj.action) {
    startCmd.play();
    executeShellCommand(matchObj.action);
    this.switch();
  } else {
    startCmd.play();
    this.switch();
  }
};

ipcRenderer.on('match', function (event, message) {
  if (message) {
    startCmd.play();
    listeners.getListeners().commandRecognition.link(listeners.getListeners().prefixRecognition);
    commandsUtil.addPhrase(matchObj.guessedCommand, matchObj.userCommand);
    executeShellCommand(matchObj.action);
  } else {
    listeners.getListeners().commandRecognition.link(listeners.getListeners().prefixRecognition);
    failedCmd.play();
  }
});
