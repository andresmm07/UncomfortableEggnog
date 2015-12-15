import React from 'react';
import {getCommands} from '../../../../commandsUtil/commandsUtil';

export default class Commands extends React.Component {
  handleClick(key) {
    console.log('You clicked: ' + this.props.items[key]);
  }
  render() {
    const commands = this.getAllCommands();
    const keys = Object.keys(commands.rawCommands);
    return (
      <ul>
        {
          keys.map(function (key) {
            return (<li>key: {key}</li>);
          })
        }
      </ul>
    );
  }
  getAllCommands() {
    return getCommands();
  }
};