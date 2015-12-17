import Constants from '../constants/constants';
import { dispatch, register } from '../dispatchers/dispatcher';

export default {
  addCommand () {
    console.log('add command');
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
    dispatch({
      actionType: Constants.DELETE_COMMAND,
      index
    });
  }
};
