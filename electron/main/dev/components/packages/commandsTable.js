import React, {PropTypes} from 'react';
import Store from '../../stores/store';
import AppActions from '../../actions/actions';
import Constants from '../../constants/constants';

export default (props) => {
  let commands = props.commands.map( (commandObj, i) => {
    var cmd = Object.keys(commandObj)[0];
    return (
      <tr
        key={i}
      >
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
            defaultValue={cmd}
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
            defaultValue={commandObj[cmd]}
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
  });
  return (
    <table className="table">
      <tbody>
        {commands}
      </tbody>
    </table>
  );
}
