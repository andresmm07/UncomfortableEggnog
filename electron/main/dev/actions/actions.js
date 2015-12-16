import Constants from '../constants/constants';
import { dispatch, register } from '../dispatchers/dispatcher';

export default {
  addCommand (command) {
    dispatch({
      actionType: Constants.ADD_COMMAND, command
    });
  }
};
