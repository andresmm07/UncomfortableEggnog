var commandsUtil = require('../commandsUtil/commandsUtil');
var executeShellComand = require('../cmd/execShellCommand');
var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var phoneticsTest = require('../match/testers/phoneticsTest');
var currentWebContent = require('remote').getCurrentWindow().webContents;

module.exports = function (event) {
  console.log("callback confirm");
  var guessed = false;
  var word = event.results[0][0].transcript;
  console.log('transcript');
  this.switch();
  if (phoneticsTest(word, 'Yes') > 0.6) {
    console.log("CONFIRM CORRECT!");
    guessed = true;
  }
  console.log('message sent!');
  currentWebContent.send("match", guessed);
  guessed = false;
};
