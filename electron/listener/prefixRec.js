var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var natural = require('natural');
var Metaphone = natural.Metaphone;
var JaroWinklerDistance = natural.JaroWinklerDistance;

module.exports = function (event) {
  console.log('got something');

  var transcript = event.results[0][0].transcript;
  var confidence = event.results[0][0].confidence;
  console.log(transcript);
  if (transcript.match(/Jarvis/gi)) {
    this.switchListener.hasTimeout = true;
    startCmd.play();
    this.switch();
  }

};
