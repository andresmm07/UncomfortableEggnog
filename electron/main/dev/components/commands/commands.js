import React from 'react';
import {getCommands} from '../../../../commandsUtil/commandsUtil';

export default class Commands extends React.Component {
  render() {
    const commands = this.getAllCommands();
    const keys = Object.keys(commands.rawCommands);
    return (
      <ul>
        { keys.map(function (key) {
          return <li>key: {key}</li>
        }
        )}
      </ul>
    );
  }
  getAllCommands() {
    return getCommands();
  }
};