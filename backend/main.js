const { app, BrowserWindow } = require('electron')

const path = require('path');

// Importing databases and running initialization
const db = require('./api/sqlite/game_database.js');

// Importing API endpoints
const getGames = require('./api/endpoints/getGames.js');
const deleteGame = require('./api/endpoints/deleteGame.js');
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