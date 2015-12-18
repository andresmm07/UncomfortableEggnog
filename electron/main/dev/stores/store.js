import { dispatch, register } from '../dispatchers/dispatcher';
import Constants from '../constants/constants';
import { EventEmitter } from 'events';
import { getCommands, updateCommands, saveCommands, delCommand } from '../../../commandsUtil/commandsUtil';


const CHANGE_EVENT = 'change';
let _commands = [];

function _saveCommands (commands) {
  let rawCommands = commands.reduce((cmdObj, cmd) => {
    if (Object.keys(cmd) === '') {
      return cmdObj;
    }
    return Object.assign(cmdObj, cmd);
  }, {});
  // _commands = _reloadCommands(rawCommands);
  updateCommands(rawCommands);
}

function _updateCommand (command) {
  let {index, change, type} = command;
  let oldCommand = Object.keys(_commands[index])[0];
  if (type === Constants.ACTION) {
    _commands[index][oldCommand] = change;
  } else if (type === Constants.COMMAND) {
    let action = _commands[index][oldCommand];
    _commands[index] = {
      [change] : action
    }
  }
}

function _reloadCommands (commandsObj) {
  let results = Object.keys(commandsObj)
    .reduce( (arr, cmd) => {
      return arr.concat({
        [cmd]: commandsObj[cmd]
      });
    }, []);
  return results;
}

function _addCommand (commands) {
  commands.push({
    "" : ""
  });
  console.log(commands);
  return commands;
}

function _deleteCommand (initialCommandsArray, index) {
  let deletedCommand = initialCommandsArray.splice(index, 1)[0];
  delCommand(Object.keys(deletedCommand)[0]);
  return initialCommandsArray;
}

const Store = Object.assign(EventEmitter.prototype, {
  emitChange () {
    this.emit( CHANGE_EVENT ); //'CHANGE'
  },
  reloadCommands () {
    return _reloadCommands(getCommands()['rawCommands']);
  },
  getCommands () {
    if (_commands.length === 0) {
      _commands = Store.reloadCommands();
    }
    return _commands.slice();
  },
  addChangeListener ( callback ) {
    this.on( CHANGE_EVENT, callback );
  },
  removeChangeListener ( callback ) {
    this.removeListener( CHANGE_EVENT, callback);
  },
  dispatcherIndex: register( function (action) {
    switch (action.actionType) {
      case Constants.SAVE_COMMANDS:
        _saveCommands(_commands);
        break;
      case Constants.ADD_COMMAND:
        _commands = _addCommand(_commands.slice());
        break;
      case Constants.UPDATE_COMMAND:
        _updateCommand(action.command);
        break;
      case Constants.DELETE_COMMAND:
        // _saveCommands(_deleteCommand(_commands, action.index));
        _commands = _deleteCommand(_commands.slice(), action.index);
        break;
    }
    Store.emitChange();
  })
});

export default Store;
