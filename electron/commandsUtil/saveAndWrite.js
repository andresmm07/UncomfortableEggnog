var fs = require('fs');
var saveCommands = require('../utils/utils').saveCommands;
var getCommands = require('../utils/utils').getCommands;


module.exports = function (commandsObj, cb) {
  console.log('save and write', commandsObj);
  saveCommands(commandsObj);
  fs.writeFile(
    commandsObj.commandPath,
    JSON.stringify(commandsObj.packageCommands),
    'utf8',
    function (err, data) {
      if (err) {
        cb(err);
      } else {
        fs.writeFile(
          commandsObj.phrasesPath,
          JSON.stringify(commandsObj.phrases),
          'utf8',
          function (err, data) {
            cb(null, getCommands());
        });
      }
    });
};
