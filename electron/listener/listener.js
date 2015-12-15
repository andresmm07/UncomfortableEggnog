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
      console.log('selfDestruct fired!');
      failedCmd.play();
      this.switch();
    }.bind(this), timeout);
  };

  listener.killTimer = function () {
    console.log('TIMER KILLED');
    window.clearTimeout(this.timer);
    console.log('hasTimeout is now', listener.hasTimeout);
  };

  listener.onstart = function (e) {
    console.log('listener.hasTimeout is ', listener.hasTimeout);
    if (listener.hasTimeout) {
      console.log('self destruct kicked off');
      this.selfDestruct();
      listener.hasTimeout = false;
    }
    on = true;
  };

  listener.switch = function () {
    console.log('switching');
    on = false;
    listener.abort();
    listener.switchListener.start();
  };
  return listener;
};
