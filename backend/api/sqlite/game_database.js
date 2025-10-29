// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Store DB in the app's folder
const dbPath = path.join(__dirname, 'games.db');
const db = new sqlite3.Database(dbPath);

// Initialize table
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      release TEXT,
      description TEXT,
      rating REAL,
      favorite INTEGER,
      date_added

    )
  `);
   db.run(`
    CREATE TABLE IF NOT EXISTS posters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id int,
      poster BLOB,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
