// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Store DB in the app's folder
const dbPath = path.join(__dirname, 'posters.db');
const posterDb = new sqlite3.Database(dbPath);

// Initialize table
posterDb.serialize(() => {
    posterDb.run(`
    CREATE TABLE IF NOT EXISTS posters (
      poster_id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      poster BLOB

    )
  `);
});

module.exports = posterDb;
