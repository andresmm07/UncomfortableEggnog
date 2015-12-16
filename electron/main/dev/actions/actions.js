import Constants from '../constants/constants';
import { dispatch, register } from '../dispatchers/dispatcher';

export defualt {
  addCommand (command) {
    dispatch({
      actionType: Constants.ADD_COMMAND, command
    });
  }
};
