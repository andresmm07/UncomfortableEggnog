import { dispatch, register } from '../dispatchers/dispatcher';
import Constants from '../constants/constants';
import { EventEmitter } from 'events';
import { getCommands, addCommand } from '../../../commandsUtil/commandsUtil';


const CHANGE_EVENT = 'change';

function _addCommand (command) {
  console.log('inside store with ', command);
  addCommand(command);
}

const Store = Object.assign(EventEmitter.prototype, {
  emitChange () {
    this.emit( CHANGE_EVENT );
  },
  getCommands () {
    getCommands().rawCommands;
  },
  addChangeListener ( callback ) {
    this.on( CHANGE_EVENT, callback );
  },
  removeChangeListener ( callback ) {
    this.removeListener( CHANGE_EVENT, callback);
  },
  dispatcherIndex: register( function (action) {
    console.log(action);
    switch (action.actionType) {
      case Constants.ADD_COMMAND:
        _addCommand( action.command );
        break;
    }
    Store.emitChange();
  })
});

export default Store;
