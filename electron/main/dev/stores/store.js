import {
  dispatch,
  register
} from '../dispatchers/dispatcher';
import Constants from '../constants/constants';
import { EventEmitter } from 'events';

import {
  _saveCommands,
  _liveUpdateCommand,
  _reloadCommands,
  _addCommand,
  _deleteCommand,
  _getCommands,
  _loadPackage,
  _changeConfig
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
  dispatcherIndex: register( (action) => {
    switch (action.actionType) {
      case Constants.SAVE_COMMANDS:
        _saveCommands(_commands, (err, newCMD) => {
          _commands = newCMD;
          Store.emitChange();
        });
        break;
      case Constants.ADD_COMMAND:
        _addCommand(_commands.slice(), (err, cmd) => {
          _commands = cmd;
          Store.emitChange();
        });
        break;
      case Constants.UPDATE_COMMAND:
        _commands = _liveUpdateCommand(_commands.slice(), action.command);
        Store.emitChange();
        break;
      case Constants.DELETE_COMMAND:
        var newCommands = _commands.slice(0, action.index)
          .concat(_commands.slice(action.index + 1));
        _deleteCommand(newCommands, (err, commands) => {
          _commands = commands;
          Store.emitChange();
        });
        break;
      case Constants.LOAD_PACKAGE:
        _commands = [];
        _loadPackage(action.filePath, (err, data) => {
          console.log('LOADED');
          console.log(data);
          Store.emitChange();
        })
        break;
      case Constants.CHANGE_CONFIG:
        _changeConfig(action.config, (err, data) => {
          console.log(data);
          Store.emitChange();
        });
        break;
    }
  })
});

export default Store;
