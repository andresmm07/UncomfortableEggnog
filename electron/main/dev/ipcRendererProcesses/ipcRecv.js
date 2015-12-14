import { ipcRenderer } from 'electron';

ipcRenderer.on('async reply', (arg) => {
  console.log(arg);
});

export default ipcRenderer;
