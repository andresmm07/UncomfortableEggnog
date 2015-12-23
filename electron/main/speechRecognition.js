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
    console.log('audio ended, restarting');
    this.stop();
  };
  var commandRecognition = listener(cmdRec, 'cmd', 5000);

  prefixRecognition.link(commandRecognition);
  commandRecognition.link(prefixRecognition);
  prefixRecognition.start();
}
