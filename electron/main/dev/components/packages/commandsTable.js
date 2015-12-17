import React, {PropTypes} from 'react';
import Store from '../../stores/store';
import AppActions from '../../actions/actions';

export default (props) => {
  let commands = props.commands.map( (commandObj, i) => {
    var cmd = Object.keys(commandObj)[0];
    return (
      <tr key={i}>
        <td>{cmd}</td>
        <td>{commandObj[cmd]}</td>
      </tr>
    );
  });
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Voice Command</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {commands}
      </tbody>
    </table>
  );
}
