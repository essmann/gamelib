// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

function getDatabasePath() {
  const dbFileName = 'external_games.db';
  const isDev = !app.isPackaged;

  if (isDev) {
    // Development: use local file
    // Development: use local file
            console.log("Dev Mode");
            console.log("Dirname: " + __dirname);
    
            const projectRoot = path.resolve(__dirname, '../../../../../'); // adjust if your dist is deeper
            console.log("Project Root: " + projectRoot);
            return path.join(projectRoot, 'src/api/sqlite/database', dbFileName);
  } else {
   
    const dbPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'external_games.db');
    return dbPath;
  }
}

// Determine DB path based on environment
const dbPath = getDatabasePath();
console.log('Using SQLite DB at:', dbPath);

// Open DB
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      release TEXT,
      short_description TEXT,
      detailed_description TEXT,
      developers TEXT,
      publishers TEXT,
      genres TEXT

    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS posters (
      id INTEGER PRIMARY KEY,
      poster BLOB,
      FOREIGN KEY (id) REFERENCES games(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
