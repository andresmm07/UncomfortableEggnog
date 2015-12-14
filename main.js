/*
http://electron.atom.io/docs/latest/tutorial/quick-start/
npm install electron-prebuilt

If you've installed electron-prebuilt globally with npm, then you will only need to run the
following in your app's source directory (electron folder):

-> electron .
*/
var electron = require('electron');
var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var globalShortcut = electron.globalShortcut;
var ipcMain = electron.ipcMain;

// Report crashes to our server.
electron.crashReporter.start();


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/electron/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  //listen only when user uses the shortcut
  //this line also regisers the shortcut ctrl+r

  //start listening when the app starts
  mainWindow.webContents.on('dom-ready', function () {
    //emitted to renderer process
    mainWindow.webContents.send('listening', 'listening');
  });

  //user doesn't want app to be always listening
  //register shortcut for listening
  ipcMain.on('registerShortcut', function () {
    console.log('registerShortcut');
    var startRecording = globalShortcut.register('ctrl+r', function () {
      //emitted to renderer process (speechRecognition and other js files loaded
      //when index.html loads) to start recording
      mainWindow.webContents.send('listening', 'shortcutListening');
    });
  });

  //user wants app to be always listening
  //unregister shortcut to avoid errors and start loop on renderer
  ipcMain.on('unregisterShortcut', function () {
    globalShortcut.unregister('ctrl+r');
    mainWindow.webContents.send('listening', 'listening');
  });

  ipcMain.on('async message', function (event, arg) {
    console.log('Got something from packages');
    mainWindow.webContents.send('async reply', 'pong');
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    //unregister shortcut when window is closed - best practice
    globalShortcut.unregister('ctrl+r');
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
