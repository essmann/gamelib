const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fileToBlob = require('../helper/fileToBlob').fileToBlob;
// Path to the single database
const dbPath = path.join(__dirname, 'games.db');
const db = new sqlite3.Database(dbPath);

// --- Populate games.db ---
db.serialize(() => {
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      release TEXT,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS posters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER NOT NULL,
      poster BLOB,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
    )
  `);

  // Insert sample games
  const games = [
    { id: 1, title: 'Zelda', release: '1986-02-21', description: 'Adventure game' },
    { id: 2, title: 'Mario', release: '1985-09-13', description: 'Platformer game' },
    { id: 3, title: 'Sonic', release: '1991-06-23', description: 'Fast-paced platformer' },
    { id: 4, title: 'Pac-Man', release: '1980-05-22', description: 'Classic arcade game' }
  ];

  const insertGame = db.prepare("INSERT INTO games (title, release, description) VALUES (?, ?, ?)");
  games.forEach(game => insertGame.run(game.title, game.release, game.description));
  insertGame.finalize();

  
  // Insert dummy posters
  const posters = [
    { game_id: 1, poster: fileToBlob(path.join(__dirname, 'seed_images', '1.png'), 'image/png') },
    { game_id: 2, poster: fileToBlob(path.join(__dirname, 'seed_images', '2.png'), 'image/png') },
    { game_id: 3, poster: fileToBlob(path.join(__dirname, 'seed_images', '3.png'), 'image/png') },
    { game_id: 4, poster: fileToBlob(path.join(__dirname, 'seed_images', '4.png'), 'image/png') }

  ];

  const insertPoster = db.prepare("INSERT INTO posters (game_id, poster) VALUES (?, ?)");
  posters.forEach(p => insertPoster.run(p.game_id, p.poster));
  insertPoster.finalize();
});

// Close database
db.close(() => console.log('✅ games.db populated with games + posters'));
