import { dispatch, register } from '../dispatchers/dispatcher';
import Constants from '../constants/constants';
import { EventEmitter } from 'events';

import {
  _saveCommands,
  _updateCommand,
  _reloadCommands,
  _addCommand,
  _deleteCommand,
  _getCommands
} from './storeActions';

const CHANGE_EVENT = 'change';
let _commands = [];

const Store = Object.assign(EventEmitter.prototype, {
  emitChange () {
    this.emit( CHANGE_EVENT ); //'CHANGE'
  },
  reloadCommands () {
    return _reloadCommands(_getCommands());
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
        _saveCommands(_commands, function (newCMD) {
          _commands = newCMD;
          console.log('saving commands');
          Store.emitChange();
        });
        break;
      case Constants.ADD_COMMAND:
        _addCommand(_commands.slice(), function (cmd) {
          _commands = cmd;
          Store.emitChange();
        });
        break;
      case Constants.UPDATE_COMMAND:
        _commands = _updateCommand(_commands.slice(), action.command);
        console.log('updating commands');
        Store.emitChange();
        break;
      case Constants.DELETE_COMMAND:
        var cmd = _commands.splice(action.index, 1)[0];
        _deleteCommand(cmd, function (commands) {
          console.log('deleted');
          console.log(cmd);
          _commands = commands;
          Store.emitChange();
        });
        break;
    }
  })
});

export default Store;
