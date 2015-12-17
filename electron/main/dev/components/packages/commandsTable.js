import React, {PropTypes} from 'react';
import Store from '../../stores/store';
import AppActions from '../../actions/actions';

export default (props) => {
  let commands = props.commands.map( (commandObj, i) => {
    var cmd = Object.keys(commandObj)[0];
    return (
      <tr key={i}>
        <td>
          <input
            type="text"
            defaultValue={cmd}
          />
        </td>
        <td>
          <input
            type="text"
            defaultValue={commandObj[cmd]}
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
