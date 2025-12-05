// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

function getDatabasePath() {
  const dbFileName = 'games.db';
  const isDev = !app.isPackaged;

  if (isDev) {
    console.log("Dev Mode");
    console.log("Dirname: " + __dirname);

    const projectRoot = path.resolve(__dirname, '../../../../../'); // adjust if needed
    console.log("Project Root: " + projectRoot);
    return path.join(projectRoot, 'src/api/sqlite/database', dbFileName);
  } else {
    return path.join(process.resourcesPath, 'app.asar.unpacked', 'games.db');
  }
}

const dbPath = getDatabasePath();
console.log('Using SQLite DB at:', dbPath);

// Open DB
const db = new sqlite3.Database(dbPath);

// Initialize tables
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      release TEXT,
      description TEXT,
      rating REAL,
      favorite INTEGER,
      isCustom INTEGER,
      date_added TEXT,
      genres TEXT,
      developers TEXT,
      publishers TEXT,
      categories TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS posters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER,
      poster BLOB,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )
`);

  db.run(`
  CREATE TABLE IF NOT EXISTS list_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
  )
`);


});

module.exports = db;
