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

// <<<<<<< HEAD
//   prefixRecognition.link(commandRecognition);
//   commandRecognition.link(prefixRecognition);
// =======
  //prefixRecognition.link(commandRecognition);
  //command has to link to prefix or confirm
  //commandRecognition.link(prefixRecognition);
  //confirm recognition only has to link to prefix
  //confirmRecognition.link(prefixRecognition);
}

//receive event emitted from main process (main.js) to start listening
ipcRenderer.on('listening', function (event) {
  console.log("Jarvis is listening!");
  var commandsUtil = require('./commandsUtil/commandsUtil');
  var config = require('./config/config');
  commandsUtil.loadPackage(config.coreCommandsJSON);
// >>>>>>> electron-master
  // prefixRecognition.start();
});
