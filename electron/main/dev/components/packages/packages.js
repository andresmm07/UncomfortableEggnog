import React, {PropTypes} from 'react';
// import UploadFile from '../uploadFile/uploadFile';
import CommandsTable from './commandsTable';
import AppActions from '../../actions/actions';
import Store from '../../stores/store';
import StoreWatchMixin from '../../mixins/mixins';
import packageUtil from '../../../../packagesUtil/packagesUtil';

function getCommands () {
  return {
    commands: Store.getCommands()
  };
}

function handleFile (e) {
  e.preventDefault();
  let self = this;
  const reader = new FileReader();
  const file = e.target.files[0];
  var path = file.path;
  var fileName = file.name;
  if (fileName.split('.')[1] !== 'json') {
    alert("The package needs to be a JSON file");
  } else {
    packageUtil.uploadPackage(path, fileName);
  }
}

const Packages = (props) => {
  return (
    <div className="row packages">
      <div className="col-xs-12">
        <div className="col-xs-4">
          <h1>Commands</h1>
        </div>
        <div className="col-xs-8">
          <h2 className="text-right" onClick={() => {
            AppActions.addCommand();
          }}>
            +
          </h2>
        </div>
      </div>
      <div className="col-xs-12">
        <table className="table commandheader">
          <thead>
            <tr>
              <th>Voice Command</th>
              <th>Action</th>
            </tr>
          </thead>
        </table>
        <div className="commandtable">
          <CommandsTable commands={props.commands}/>
        </div>
      </div>
      <div className="row">
        <div className="col-xs-3 pull-right">
          <form className="uploadButton" encType="multipart/form-data">
            <button onClick={ e => {document.getElementById('upload').click();}}
                    className="btn btn-success">
              Add Package
            </button>
            <input
              id="upload"
              style={{opacity: 0}}
              type="file"
              onChange={handleFile.bind(this)}
            />
          </form>
        </div>
      </div>
    </div>
    );
};


export default StoreWatchMixin(Packages, getCommands);
