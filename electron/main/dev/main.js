import React from 'react';
import { render } from 'react-dom';
import AppContainer from './components/appContainer'
import ipcRenderer from './ipcRendererProcesses/ipcRecv';
require('./stylesheets/main.scss');

render(<AppContainer />, document.getElementById('app'));
