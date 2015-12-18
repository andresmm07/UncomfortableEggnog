var ipcRenderer = require('electron').ipcRenderer;
var listener = require('./listener/listener');
var prefixRec = require('./listener/prefixRec');
var cmdRec = require('./listener/cmdRec');

// var listening = true;

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  //instance that will listen for the prefix
  var prefixRecognition = listener(prefixRec, 'prefix');
  prefixRecognition.interimResults = true;
  prefixRecognition.onaudioend = function () {
    console.log('audio ended, restarting');
    this.stop();
  };
  //instance that will listen for the command
  //TODO: 5s timeout is too short for commands with 2+ phrases/arguments.  Way to extend during speech input?
  var commandRecognition = listener(cmdRec, 'cmd', 10000);
  // connect the two so that the prefixRec will stop its process and kick off
  // its link
  prefixRecognition.link(commandRecognition);
  commandRecognition.link(prefixRecognition);
}

//receive event emitted from main process (main.js) to start listening
ipcRenderer.on('listening', function (event) {
  console.log("Jarvis is listening!");
  var commandsUtil = require('./commandsUtil/commandsUtil');
  var config = require('./config/config');
  commandsUtil.loadPackage(config.coreCommandsJSON);
  console.log(ipcRenderer);
  prefixRecognition.start();
});


// //function to toggle between keypress shortcut and always listening
// var toggleListen = function (event) {
//   if (listening) {
//     listening = false;
//     //register shortcut and stop listening
//     ipcRenderer.send('registerShortcut', "true");
//     //stop the infinite loop
//     prefixRecognition.onend = function (event) {
//       prefixRecognition.stop();
//     };
//   } else {
//     listening = true;
//     //start always listening
//     ipcRenderer.send('unregisterShortcut', "true");
//     //start the infinite loop
//     prefixRecognition.onend = function (event) {
//       prefixRecognition.start();
//     };
//   }
// };
//
// //we will need to refactor this to react instead of jquery if we use react for front-end
// $('button').on('click', toggleListen);
