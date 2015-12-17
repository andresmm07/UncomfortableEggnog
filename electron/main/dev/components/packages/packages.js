import React, {PropTypes} from 'react';
import UploadFile from '../uploadFile/uploadFile';
import CommandsTable from './commandsTable';
import AppActions from '../../actions/actions';
import Store from '../../stores/store';
import StoreWatchMixin from '../../mixins/mixins';


function getCommands () {
  console.log('packages rerendered with new state');
  return {
    commands: Store.getCommands()
  };
}

const Packages = (props) => {
  return (
    <div className="row">
      <div className="col-xs-12">
        <div className="col-xs-4">
          <h1>Commands</h1>
          <UploadFile />
        </div>
        <div className="col-xs-8">
          <h2 className="text-right" onClick={() => {
            AppActions.addCommand();
          }}>
            +
          </h2>
        </div>
      </div>
      <div className="col-xs-12 commandtable">
        <CommandsTable commands={props.commands}/>
      </div>
    </div>
    );
};


export default StoreWatchMixin(Packages, getCommands)



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
