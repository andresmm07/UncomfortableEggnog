var startCmd = require('../audio/audio').startCmd;
var failedCmd = require('../audio/audio').failedCmd;
var ipcRenderer = require('electron').ipcRenderer;

module.exports = function (cb, name, timeout) {

  var listener = new webkitSpeechRecognition();
  listener.hasTimeout = timeout ? true : false;
  listener.name = name;
  listener.lang = "en-US";
  var on;

  listener.onend = function (event) {
    if (on) {
      this.start();
    }
  };
  listener.onresult = cb;

  listener.pause = function () {
    console.log(this.name, 'has been paused');
    on = false;
    this.stop();
  };

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
    console.log(this.name, ' started!');
    // console.log(this.switchListener.name, ' will start!');
    if (listener.hasTimeout) {
      this.selfDestruct();
      listener.hasTimeout = false;
    }
    on = true;
  };

  listener.switch = function () {
    on = false;
    listener.abort();
    console.log(listener);
    listener.switchListener.start();
  };

  return listener;
};
