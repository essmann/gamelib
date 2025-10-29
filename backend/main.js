const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// --- Detect production mode ---
const isDev = !app.isPackaged;

// --- Database setup ---
const db = require('./api/sqlite/game_database.js');

// --- API endpoints ---
const addGame = require('./api/endpoints/addGame.js');
const updateGame = require('./api/endpoints/updateGame.js');
const deleteGame = require('./api/endpoints/deleteGame.js');
const getGames = require('./api/endpoints/getGames.js');
const Game = require('./api/game.js').Game;

// --- IPC handlers ---
ipcMain.handle('add-game', async (event, game) => {
  console.log("add-game handler called with game:", game);
  const gameObject = new Game(game);
  return await addGame.addGame(db, gameObject);
});

ipcMain.handle('update-game', async (event, game) => {
  const gameObject = new Game(game);
  return await updateGame.updateGame(db, gameObject);
});

ipcMain.handle('delete-game', async (event, id) => {
  return await deleteGame.deleteGame(db, id);
});

ipcMain.handle('get-games', async () => {
  const now = Date.now();
  const rows = await getGames.getGames(db);
  const games = rows.map(row => new Game(row));
  console.log("Time taken:", (Date.now() - now) / 1000, "seconds");
  return games;
});

// --- Create window ---
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173/');
  } else {
    // Load your compiled front-end (e.g. from Vite or React build)
    win.loadFile("./dist/index.html");
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
