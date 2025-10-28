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



ipcMain.handle('add-game', async (event, game) => {
    console.log("add-game handler called with game: " + JSON.stringify(game));
    return await addGame.addGame(db, game);
})

ipcMain.handle('update-game', async (event, game) => {
    return await updateGame.updateGame(db, game);
})

ipcMain.handle('delete-game', async (event, id) => {
    return await deleteUserGame.deleteUserGame(db, id);
});
ipcMain.handle('get-games', async () => {
  return await getGames.getGames(db);
})


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