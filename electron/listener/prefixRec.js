var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var phoneticsTest = require('../match/testers/phoneticsTest');
var regMatch = require('../match/regMatch');
var ipcRenderer = require('electron').ipcRenderer;
var name = "Jarvis";

ipcRenderer.on('nameChanged', function (event, message) {
  name = message;
});

module.exports = function (event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    var word = event.results[i][0].transcript;
    //console.log(word);
    if (phoneticsTest(word, name) > 0.8) {
      this.switchListener.hasTimeout = true;
      startCmd.play();
      console.log('prefix switch');
      this.switch();
    }
  }
};
