const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.handle('copy-laz', async (req, data) => {
    const { lazName, searchingFolderPath, copingFolderPath } = data;
    const destinationDir = copingFolderPath;
    const sourceFilePath = `${searchingFolderPath}/${lazName}.laz`;
    const fileName = path.basename(sourceFilePath);
    const destinationFilePath = path.join(destinationDir, fileName);

    try {
      const isSucceed = new Promise((res, rej) => {
        fs.copyFile(
          sourceFilePath,
          destinationFilePath,
          fs.constants.COPYFILE_EXCL,
          async (err) => {
            if (err) {
              console.error('error:', err);
              rej(err);
            } else {
              console.log('success');
              res(true);
            }
          }
        );
      })
        .then((data) => data)
        .catch((err) => false);

      return await isSucceed;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
