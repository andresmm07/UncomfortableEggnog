var updateCommandObj = require('./updateCommands');
var read = require('../utils/utils').read;
module.exports = function (commandPath, callback) {
  read(commandPath, function (err, packageObj) {
    console.log(packageObj);
    if (err) {
      console.log(err);
      var commandObj = updateCommandObj({});
    } else {
      var commandObj = updateCommandObj(packageObj);
    }
    commandObj.commandPath = commandPath;
    commandObj.phrasesPath = commandPath.replace('commands.', 'phrases.');
    callback(null, commandObj);
  });
};
