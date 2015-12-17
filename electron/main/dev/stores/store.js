import { dispatch, register } from '../dispatchers/dispatcher';
import Constants from '../constants/constants';
import { EventEmitter } from 'events';
import { getCommands, addCommand } from '../../../commandsUtil/commandsUtil';


const CHANGE_EVENT = 'change';
let _commands = [];

function _saveCommand (command) {
  addCommand(command);
}

function _reloadCommands (commandsObj) {
  let results = Object.keys(commandsObj['rawCommands'])
    .reduce( (arr, cmd) => {
      return arr.concat({
        [cmd]: commandsObj['rawCommands'][cmd]
      });
    }, []);
  return results;
}

function _addCommand (initialCommandsArray) {
  return initialCommandsArray.unshift({
    command: 'action'
  });
}


const Store = Object.assign(EventEmitter.prototype, {
  emitChange () {
    this.emit( CHANGE_EVENT );
  },
  reloadCommands () {
    return _reloadCommands(getCommands());
  },
  getCommands () {
    if (_commands.length === 0) {
      _commands = Store.reloadCommands();
    }
    console.log('inside store getCommands', _commands);
    return _commands;
  },
  addChangeListener ( callback ) {
    this.on( CHANGE_EVENT, callback );
  },
  removeChangeListener ( callback ) {
    this.removeListener( CHANGE_EVENT, callback);
  },
  dispatcherIndex: register( function (action) {
    switch (action.actionType) {
      case Constants.SAVE_COMMAND:
        _saveCommand( action.command );
        break;
      case Constants.ADD_COMMAND:
        console.log('in store, add command firing');
        _addCommand(_commands);
        break;
    }
    Store.emitChange();
  })
});

export default Store;
