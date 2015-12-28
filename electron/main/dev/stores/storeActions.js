import {
  getCommands,
  updateCommands,
  saveCommands,
  delCommand,
  loadPackage
} from '../../../commandsUtil/commandsUtil';
import Constants from '../constants/constants';

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
  //TODO: update config
  loadPackage({
    commandsPath: filePath
  }, cb);
}


export function _deleteCommand (command, cb) {
  // console.log('_deleteCommand');
  // delCommand(Object.keys(command)[0], function (commands) {
  //   console.log('got callback');
  //   console.log(commands);
  //   cb(_reloadCommands(commands));
  // });
  _saveCommands(command, cb);
}
