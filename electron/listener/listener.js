var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;

module.exports = function (cb, name, timeout) {
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

  listener.selfDestruct = function () {
    this.timer = window.setTimeout(function () {
      console.log('switch!');
      failedCmd.play();
      this.killTimer();
      this.switch();
    }.bind(this), timeout);
  };

  listener.killTimer = function () {
    console.log('TIMER KILLED');
    window.clearTimeout(this.timer);
  };

  listener.onstart = function (e) {
    if (timeout) {
      this.selfDestruct();
    }
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
