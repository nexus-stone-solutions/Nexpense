import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getExpenses, removeExpense, addExpense } from './database.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let mainWindow;

function createWindow() {
  const preloadPath = isDev
  ? path.resolve(__dirname, 'preload.js')
  : path.reslove(app.getAppPath(), 'build/preload.js');

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(__dirname, "logo", "logo.png"),
    webPreferences: {
      contextIsolation: true,
      preload: preloadPath,
    },
  });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.resolve(app.getAppPath(), 'build/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => (mainWindow = null));
}

// Handle backend calls
ipcMain.handle('get-expenses', async () => {
  try {
    return await getExpenses();
  } catch (err) {
    console.error('Error fetching expenses:', err.message);
    return [];
  }
});

ipcMain.handle('remove-expense', async (_, id) => {
  try {
    return await removeExpense(id);
  } catch (err) {
    console.error('Error removing expense:', err.message);
    return err.message || "error";
  }
});

ipcMain.handle('add-expense', async (_, expenseData) => {
  try {
    return await addExpense(expenseData);
  } catch (err) {
    console.error('Error adding expense:', err.message);
    return err.message || "error";
  }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error(`Failed to load: ${errorDescription} (${errorCode})`);
    });
  }
  // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
  else if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
