import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import path from 'path';

// --- Detect production mode ---
const isDev = !app.isPackaged;

// --- Database setup ---
import  db  from './api/sqlite/game_database';
import  external_db  from './api/sqlite/external_db';

// --- API endpoints ---
import addGame  from './api/endpoints/addGame';
import { updateGame } from './api/endpoints/updateGame';
import { deleteGame } from './api/endpoints/deleteGame';
import { getGames } from './api/endpoints/getGames';
import { getExternalGames } from './api/endpoints/getExternalGames';
import {Game}  from './api/game';

// --- IPC handlers ---
ipcMain.handle('add-game', async (event: IpcMainInvokeEvent, gameData: Game): Promise<Game> => {
  console.log("Hey");
  const gameObject = new Game(gameData);
  let game =  await addGame(db, gameObject);
  return game ;
});
//
ipcMain.handle('update-game', async (event: IpcMainInvokeEvent, gameData: Game): Promise<void> => {
  const gameObject = new Game(gameData);
  return await updateGame(db, gameObject);
});
//

ipcMain.handle('delete-game', async (event: IpcMainInvokeEvent, id: string | number): Promise<void> => {
  console.log('Deleting game with id:', id);
  await deleteGame(db, id);
});

ipcMain.handle('get-games', async (): Promise<Game[]> => {
  const now = Date.now();
  const rows = await getGames(db);
  const games = rows.map(row => new Game(row));
  console.log('Time taken:', (Date.now() - now) / 1000, 'seconds');
  return games;
});

ipcMain.handle('get-external-games', async (event: IpcMainInvokeEvent, prefix: string): Promise<any> => {
  console.log('Fetching external games with prefix:', prefix);
  return await getExternalGames(external_db, prefix);
});

// --- Create window ---
const createWindow = (): void => {
  console.log("Creating window...");
  console.log("__dirname:", __dirname);
  console.log("isDev:", isDev);
  console.log("Preload path:", path.join(__dirname, './preload.js'));
  console.log("Dirname " + __dirname);
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'), // Adjust for dist folder
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173/');
  } else {
    win.loadFile(path.join(__dirname, './index.html')); // Adjust for build output
  }
};

// --- App lifecycle ---
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
