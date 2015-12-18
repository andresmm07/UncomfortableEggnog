var ipcRenderer = require('electron').ipcRenderer;
var listener = require('./listener/listener');
var prefixRec = require('./listener/prefixRec');
var cmdRec = require('./listener/cmdRec');
var confirmRec = require('./listener/confirmRec');
var listeners = require('./listener/listeners');

if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  listeners.init();
  //instance that will listen for the prefix
  //var prefixRecognition = listener(prefixRec, 'prefix');
  var prefixRecognition = listeners.getListeners().prefixRecognition;
  prefixRecognition.interimResults = true;
  prefixRecognition.onaudioend = function () {
    console.log('audio ended, restarting');
    this.stop();
  };
  // var commandRecognition = listener(cmdRec, 'cmd', 5000);
  commandRecognition = listeners.getListeners().commandRecognition;
  // var confirmRecognition = listener(confirmRec, 'confirm');
  confirmRecognition = listeners.getListeners().confirmRecognition;
  // connect the two so that the prefixRec will stop its process and kick off
  // its link
  //prefix only has to link to command

  prefixRecognition.link(commandRecognition);
  //command has to link to prefix or confirm
  commandRecognition.link(prefixRecognition);
  //confirm recognition only has to link to prefix
  confirmRecognition.link(prefixRecognition);
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

// ipcRenderer.on('test', function (event) {
//   console.log("confirm!!");
//   commandRecognition.link(confirmRecognition);
//   //commandRecognition.switch();
// });
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
