// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Store DB in the app's folder
const dbPath = path.join(__dirname, 'games.db');
const db = new sqlite3.Database(dbPath);

// Initialize table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      release TEXT,
      description TEXT

    )
  `);
});

module.exports = db;
