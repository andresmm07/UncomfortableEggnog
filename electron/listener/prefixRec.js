var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var phoneticsTest = require('../match/testers/phoneticsTest');
var regMatch = require('../match/regMatch');

module.exports = function (event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    var word = event.results[i][0].transcript;
    // console.log(word);
    if (phoneticsTest(word, 'Jarvis') > 0.8) {
      this.switchListener.hasTimeout = true;
      startCmd.play();
      this.switch();
    }
  }
};
