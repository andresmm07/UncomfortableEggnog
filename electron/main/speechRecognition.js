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
  var config = require('./config/config');
  require('./config/configUtils').get(function (err, data) {
    // load name into localStorage
    console.log('data1: ', JSON.parse(data));
    console.log('data2: ', config);
    localStorage.setItem('name', 'jarvis');
    commandsUtil.loadPackage(JSON.parse(data), function (err, data) {
      prefixRecognition.start();
    });
  });

});
