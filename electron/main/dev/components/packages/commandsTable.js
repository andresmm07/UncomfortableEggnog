import React, {PropTypes} from 'react';
import Store from '../../stores/store';
import StoreWatchMixin from '../../mixins/mixins';

function getCommands () {
  return {
    commands: Store.getCommands()
  }
}


const CommandsTable = (props) => {
  let commands = Object.keys(props.commands).map( (command, i) => {
    return (
      <tr key={i}>
        <td>{command}</td>
        <td>{props.commands[command]}</td>
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

export default StoreWatchMixin(CommandsTable, getCommands)
