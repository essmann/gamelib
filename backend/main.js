const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const fs = require('fs')

const path = require('path');

// Importing databases and running initialization
const db = require('./api/sqlite/game_database.js');

// Importing API endpoints
const addGame = require('./api/endpoints/addGame.js')
const updateGame = require('./api/endpoints/updateGame.js')
const deleteGame = require('./api/endpoints/deleteGame.js')
const getGames = require('./api/endpoints/getGames.js')

// Importing game class. All responses from the backend will be wrapped in this class for standardization. We will also wrap incoming objects in this class to ensure they have the correct structure.
const Game = require('./api/game.js').Game;

ipcMain.handle('add-game', async (event, game) => {
    console.log("add-game handler called with game: " + JSON.stringify(game));
    const gameObject = new Game(game);
    return await addGame.addGame(db, gameObject);
})

ipcMain.handle('update-game', async (event, game) => {
    const gameObject = new Game(game);
    return await updateGame.updateGame(db, gameObject);
})

ipcMain.handle('delete-game', async (event, id) => {
    return await deleteUserGame.deleteUserGame(db, id);
});
ipcMain.handle('get-games', async () => {
    const now = Date.now();
  const rows = await getGames.getGames(db);
  const games = rows.map(row => new Game(row));
  const elapsed_time =  Date.now() - now;
  console.log("Time taken: " + elapsed_time/1000 + " seconds");
  return games;
});



const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadURL('http://localhost:5173/')
}



app.whenReady().then(() => {
    createWindow();

})