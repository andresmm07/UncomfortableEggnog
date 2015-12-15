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
  prefixRecognition.continuous = true;
  prefixRecognition.interimResults = true;
  //instance that will listen for the command
  var commandRecognition = listener(cmdRec, 'cmd', 5000);
  // connect the two so that tdhe prefixRec will stop its process and kick off
  // it's link
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
