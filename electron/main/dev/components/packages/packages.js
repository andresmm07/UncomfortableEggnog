import React, {PropTypes} from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router';
import UploadFile from '../uploadFile/uploadFile';
import CommandsTable from './commandsTable';
import { getCommands } from '../../../../commandsUtil/commandsUtil';

export default class Packages extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h1>Commands</h1>
          <UploadFile></UploadFile>
        </div>
        <div className="col-xs-12">
          <CommandsTable commands={this.getCommands()}/>
        </div>
      </div>
      );
  }
  getCommands () {
    return getCommands().rawCommands;
  }
};



// <div className="col-md-4">
// </div>
// <div className="col-md-4">
// <Link to="addCommand">
// <button>Add Command</button>
// </Link>
// </div>
// <div className="col-md-4">
// <Link to="editCommand">
// <button>Edit Command</button>
// </Link>
// </div>
// <div className="col-md-12">
// List of Packages
// </div>
