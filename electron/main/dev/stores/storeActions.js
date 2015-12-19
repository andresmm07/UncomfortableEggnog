import { getCommands, updateCommands, saveCommands, delCommand } from '../../../commandsUtil/commandsUtil';
import Constants from '../constants/constants';

export function _getCommands () {
  return getCommands()['rawCommands'];
}

export function _saveCommands (commands, cb) {
  let rawCommands = commands.reduce( (cmdObj, cmd) => {
    if (Object.keys(cmd) === '') {
      return cmdObj;
    }
    return Object.assign(cmdObj, cmd);
  }, {});
  updateCommands(rawCommands, function (cmd) {
    cb(_reloadCommands(cmd));
  });
}

export function _updateCommand (cmdObj, command) {
  let {index, change, type} = command;
  let oldCommand = Object.keys(cmdObj[index])[0];
  if (type === Constants.ACTION) {
    cmdObj[index][oldCommand] = change;
  } else if (type === Constants.COMMAND) {
    let action = cmdObj[index][oldCommand];
    cmdObj[index] = {
      [change] : action
    }
  }
  return cmdObj;
}

export function _reloadCommands (commandsObj) {
  let results = Object.keys(commandsObj)
    .reduce( (arr, cmd) => {
      return arr.concat({
        [cmd]: commandsObj[cmd]
      });
    }, []);
  return results;
}


export function _addCommand (commands, cb) {
  commands.push({
    "" : ""
  });
  console.log(commands);
  _saveCommands(commands, function (cmd) {
    console.log('added and saved!');
    cb(cmd);
  });
}


export function _deleteCommand (command, cb) {
  console.log('_deleteCommand');
  delCommand(Object.keys(command)[0], function (commands) {
    console.log('got callback');
    cb(_reloadCommands(commands));
  });
}
