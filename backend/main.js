const { app, BrowserWindow } = require('electron')
const path = require('path');
// Importing databases and running initialization
const db = require('./api/sqlite/game_database.js');
const posterDb = require('./api/sqlite/poster_database.js');

// Importing API endpoints
const getGames = require('./api/endpoints/getGames.js');
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
    getGames.getGames(db).then(games => {
        console.log('Games from main.js:', games);
    }).catch(err => {
        console.error('Error fetching games in main.js:', err);
    });

})