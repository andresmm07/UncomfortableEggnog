var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;

module.exports = function (cb, name, timeout) {
  var listener = new webkitSpeechRecognition();
  listener.hasTimeout = timeout ? true : false;
  listener.name = name;
  var on;

  listener.onend = function (event) {
    if (on) {
      console.log('restarting', this.name);
      this.start();
    }
  };
  listener.onresult = cb;

  listener.switchListener;
  listener.link = function (otherListener) {
    listener.switchListener = otherListener;
  };

  listener.selfDestruct = function () {
    this.timer = window.setTimeout(function () {
      failedCmd.play();
      this.switch();
    }.bind(this), timeout);
  };

  listener.killTimer = function () {
    window.clearTimeout(this.timer);
  };

  listener.onstart = function (e) {
    if (listener.hasTimeout) {
      this.selfDestruct();
      listener.hasTimeout = false;
    }
    on = true;
  };

  listener.switch = function () {
    console.log('switching to ', listener.switchListener.name);
    on = false;
    listener.abort();
    listener.switchListener.start();
  };
  return listener;
};
