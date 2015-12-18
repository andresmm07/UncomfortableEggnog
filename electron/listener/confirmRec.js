var commandsUtil = require('../commandsUtil/commandsUtil');
var executeShellComand = require('../cmd/execShellCommand');
var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var phoneticsTest = require('../match/testers/phoneticsTest');
var currentWebContent = require('remote').getCurrentWindow().webContents;

module.exports = function (event) {
  var word = event.results[0][0].transcript;
  console.log("word: ", word);
  if (phoneticsTest(word, 'yes ') > 0.5) {
    this.switch();
    currentWebContent.send("correct", "correct");

    return;
  }

  this.switch();
  failedCmd.play();
  currentWebContent.send("incorrect", "correct");
};
