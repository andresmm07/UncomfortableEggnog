var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var phoneticsTest = require('../match/testers/phoneticsTest');
var regMatch = require('../match/regMatch');
var ipcRenderer = require('electron').ipcRenderer;
var configUtils = require('../config/configUtils');

var name = localStorage.getItem('name');

module.exports = function (event) {
  // Should be function call to get name
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    var word = event.results[i][0].transcript;
    if (phoneticsTest(word, name) > 0.8) {
      this.switchListener.hasTimeout = true;
      startCmd.play();
      this.switch();
    }
  }
};
