var exec = require('child_process').exec;

module.exports = function (shellCommand, cb) {
  exec(shellCommand, function (error, stdout, stderr) {
    if (error) {
      console.log(error);
      // throw new Error(error);
      if (cb) {
        cb(error);
      }
    }
    if (cb) {
      cb(null);
    }
  });
};
