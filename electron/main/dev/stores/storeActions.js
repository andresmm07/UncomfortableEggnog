import {
  updateCommands,
  saveCommands,
  delCommand,
  loadPackage
} from '../../../commandsUtil/commandsUtil';
import { writeConfig, getConfig } from '../../../config/configUtils';
import Constants from '../constants/constants';
import { getCommands, get } from '../../../utils/utils';

export function _getCommands () {
  return getCommands()['packageCommands'];
}

/*
  _saveCommands takes the _commands array from the store and
  reduces it back into one commandsObj. It is then shipped off
  to updateCommands in the commandsUtils where the updated commands
  are merged into the commandsObj, saved and written
*/

export function _saveCommands (commands, cb) {
  let packageCommands = commands.reduce( (cmdObj, cmd) => {
    if (Object.keys(cmd) === '') {
      return cmdObj;
    }
    return Object.assign(cmdObj, cmd);
  }, {});
  updateCommands(packageCommands, function (err, cmd) {
    cb(null, _reloadCommands(cmd));
  });
}

/*
  _liveUpdateCommand live updates the command - if you make changes in the view
  _liveUpdateCommand will update the _commands array in the store.

  it takes an object which tells the store what changes are being made:
  index - the index of the command being edited
  change - is the change being made
  type - command or action field

  we then find the index of the command being edited in _commands and
  changes the object live.
*/

export function _liveUpdateCommand (_commands, command) {
  let {index, change, type} = command;
  let oldCommand = Object.keys(_commands[index])[0];
  if (type === Constants.ACTION) {
    _commands[index][oldCommand] = change;
  } else if (type === Constants.COMMAND) {
    let action = _commands[index][oldCommand];
    _commands[index] = {
      [change] : action
    };
  }
  return _commands;
}

/*
  takes the commands object from commandsUtil and converts it to an array
*/

export function _reloadCommands (commandsObj) {
  let results = Object.keys(commandsObj)
    .reduce( (arr, cmd) => {
      return arr.concat({
        [cmd]: commandsObj[cmd]
      });
    }, []);
  return results;
}

/*
  adds an empty object into a field, then saves
  the changes in the commandsUtil
*/
export function _addCommand (commands, cb) {
  commands.push({
    "command" : "action"
  });
  _saveCommands(commands, function (err, cmd) {
    cb(null, cmd);
  });
}

export function _loadPackage (filePath, cb) {
  writeConfig({
    commandsPath: filePath,
    phrasesPath: filePath.replace('commands.', 'phrases.')
  }, function (err, data) {
    loadPackage(data, cb);
  });
}

export function _saveConfig (config, cb) {
  writeConfig(config, function (err, data) {
    cb(err, data);
  });
}

export function _getConfig () {
  let name = localStorage.getItem('name');
  console.log(name);
  let exactMatchThreshold = get('exactMatchThreshold');
  let closeMatchThreshold = get('closeMatchThreshold');
  return {
    name,
    exactMatchThreshold,
    closeMatchThreshold
  };
}


export function _deleteCommand (command, cb) {
  _saveCommands(command, cb);
}
