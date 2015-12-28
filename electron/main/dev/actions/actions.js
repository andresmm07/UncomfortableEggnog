import Constants from '../constants/constants';
import { dispatch, register } from '../dispatchers/dispatcher';

export default {
  addCommand () {
    dispatch({
      actionType: Constants.ADD_COMMAND
    });
  },
  saveCommands () {
    dispatch({
      actionType: Constants.SAVE_COMMANDS
    });
  },
  updateCommand (command) {
    dispatch({
      actionType: Constants.UPDATE_COMMAND,
      command
    });
  },
  deleteCommand (index) {
    console.log('Inside actions, passing store, ', index);
    dispatch({
      actionType: Constants.DELETE_COMMAND,
      index
    });
  },
  loadPackage (filePath) {
    dispatch({
      actionType: Constants.LOAD_PACKAGE,
      filePath
    });
  }
};
