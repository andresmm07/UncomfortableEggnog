var listener = require('./listener');

var prefixRecognition;
var commandRecognition;
var confirmRecognition;

module.exports.init = function () {
  prefixRecognition = listener(prefixRec, 'prefix');
  commandRecognition = listener(cmdRec, 'cmd', 5000);
  confirmRecognition = listener(confirmRec, 'confirm', 5000);
};

module.exports.getListeners = function () {
  return {
    prefixRecognition: prefixRecognition,
    commandRecognition: commandRecognition,
    confirmRecognition: confirmRecognition
  };
};
