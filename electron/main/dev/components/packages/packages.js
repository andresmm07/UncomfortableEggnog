import React, {PropTypes} from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router';
import UploadFile from '../uploadFile/uploadFile';
import CommandsTable from './commandsTable';
import { getCommands } from '../../../../commandsUtil/commandsUtil';
import AppActions from '../../actions/actions';

export default class Packages extends React.Component {
  render() {
    console.log(AppActions);
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="col-xs-4">
            <h1>Commands</h1>
            <UploadFile />
          </div>
          <div className="col-xs-8">
            <h2 className="text-right" onClick={() => {
              AppActions.addCommand({test: 'test'})
            }}>
              +
            </h2>
          </div>
        </div>
        <div className="col-xs-12 commandtable">
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
