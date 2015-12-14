import React, {PropTypes} from 'react';
// import { ipcRenderer } from 'electron';
var ipcRenderer = require('electron').ipcRenderer;

export default class Packages extends React.Component {

  render() {
    let saying = "Packages";
    return (
      <div onClick={(e) => {
        ipcRenderer.send('async message', saying);
        ipcRenderer.on('async reply', (event, arg) => {
          console.log('got something!!!!');
          console.log(arg);
        });
      }}>
        {saying}
      </div>);
  }
};
