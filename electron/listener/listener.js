var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;

module.exports = function (cb, name) {
  var listener = new webkitSpeechRecognition();

  listener.name = name;
  var on;

  listener.onend = function (event) {
    console.log('ended ', this.name);
    if (on) {
      this.start();
    }
  };
  listener.onresult = cb;

  var switchListener;
  listener.link = function (otherListener) {
    switchListener = otherListener;
  };

  listener.onstart = function (e) {
    console.log('starting', this.name);
    on = true;
  };

  listener.switch = function () {
    console.log('aborting');
    on = false;
    listener.abort();
    console.log('starting');
    switchListener.start();
  };
  return listener;
};
