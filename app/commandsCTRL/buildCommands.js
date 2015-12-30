var updateCommandObj = require('./updateCommands');
var read = require('../utils/utils').read;
module.exports = function (commandPath, callback) {
  read(commandPath, function (err, packageObj) {
    if (err) {
      callback(err);
    } else {
      var commandObj = updateCommandObj(packageObj);
      commandObj.commandPath = commandPath;
      commandObj.phrasesPath = commandPath.replace('commands.', 'phrases.');
      callback(null, commandObj);
    }
  });
};
