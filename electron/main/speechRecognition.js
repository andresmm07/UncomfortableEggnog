var ipcRenderer = require('electron').ipcRenderer;
var listener = require('./listener/listener');
var prefixRec = require('./listener/prefixRec');
var cmdRec = require('./listener/cmdRec');


if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var prefixRecognition = listener(prefixRec, 'prefix');
  prefixRecognition.interimResults = true;

  prefixRecognition.onaudioend = function () {
    this.stop();
  };
  var commandRecognition = listener(cmdRec, 'cmd', 5000);

  prefixRecognition.link(commandRecognition);
  commandRecognition.link(prefixRecognition);
}

ipcRenderer.on('listening', function (event) {
  console.log("Jarvis is listening!");
  var commandsUtil = require('./commandsUtil/commandsUtil');
  // var config = require('./config/config');
  var configUtils = require('./config/configUtils');
  configUtils.getConfig(function (err, data) {
    // // load name into localStorage
    var config = JSON.parse(data);
    commandsUtil.loadPackage(JSON.parse(data), function (err, data) {
      configUtils.saveConfig(config);
      prefixRecognition.start();
    });
  });

});
