import React, {PropTypes} from 'react';
import Store from '../../stores/store';
import AppActions from '../../actions/actions';
import Constants from '../../constants/constants';
import StoreWatchMixin from '../../mixins/mixins';

function getCommands () {
  return {
    commands: Store.getCommands()
  };
}

// NOTE: NEVER USE DEFAULTVALUE.


const CommandsTable = (props) => {
  let { commands } = props;
  return (
    <table className="table">
      <tbody>
        {commands.map( (commandObj, i) => {
          var cmd = Object.keys(commandObj)[0];
          return (
            <tr key={i}>
              <td
                onClick={ e => {
                  AppActions.deleteCommand(i)
                }}
              >
                x
              </td>
              <td>
                <input
                  type="text"
                  value={cmd}
                  onChange={e => {
                    AppActions.updateCommand({
                      index: i,
                      change: e.target.value,
                      type: Constants.COMMAND
                    });
                  }}
                  onBlur={e => AppActions.saveCommands()}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={commandObj[cmd]}
                  onChange={e => {
                    AppActions.updateCommand({
                      index: i,
                      change: e.target.value,
                      type: Constants.ACTION
                    });
                  }}
                  onBlur={e => AppActions.saveCommands()}
                  />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default StoreWatchMixin(CommandsTable, getCommands)
