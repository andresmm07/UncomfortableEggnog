var ipcMain = require('electron').ipcMain;

ipcMain.on('async message', function (event, arg) {
  console.log(arg);
  event.sender.send('async reply', 'pong');
});
