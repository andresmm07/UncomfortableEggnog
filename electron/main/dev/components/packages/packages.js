import React, {PropTypes} from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router';
import UploadFile from '../uploadFile/uploadFile';
//var ipcRenderer = require('electron').ipcRenderer;

// <div onClick={(e) => {
//   ipcRenderer.send('async message', saying);
//   ipcRenderer.on('async reply', (event, arg) => {
//     console.log('got something!!!!');
//     console.log(arg);
//   });
// }}>
//   {saying}
// </div>
export default class Packages extends React.Component {

  render() {
    let saying = "Packages";
    return (
      <div className="row">
        <div className="col-md-4">
          <UploadFile></UploadFile>
        </div>
        <div className="col-md-4">
          <Link to="addCommand">
            <button>Add Command</button>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="editCommand">
            <button>Edit Command</button>
          </Link>
        </div>
        <div className="col-md-12">
          List of Packages
        </div>
      </div>
      );
  }
};
