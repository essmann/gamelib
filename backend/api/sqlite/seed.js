const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Paths to your databases
const gamesPath = path.join(__dirname, 'games.db');
const postersPath = path.join(__dirname, 'posters.db');

// Open databases
const gamesDb = new sqlite3.Database(gamesPath);
const postersDb = new sqlite3.Database(postersPath);

// --- Populate games.db ---
gamesDb.serialize(() => {
  gamesDb.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    release TEXT,
    description TEXT
  )`);

  const games = [
    { title: 'Zelda', release: '1986-02-21', description: 'Adventure game' },
    { title: 'Mario', release: '1985-09-13', description: 'Platformer game' },
    { title: 'Sonic', release: '1991-06-23', description: 'Fast-paced platformer' },
    { title: 'Pac-Man', release: '1980-05-22', description: 'Classic arcade game' }
  ];

  const stmt = gamesDb.prepare("INSERT INTO games (title, release, description) VALUES (?, ?, ?)");
  games.forEach(game => stmt.run(game.title, game.release, game.description));
  stmt.finalize();
});

// --- Populate posters.db with dummy BLOBs ---
postersDb.serialize(() => {
  postersDb.run(`CREATE TABLE IF NOT EXISTS posters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER,
    poster BLOB
  )`);

  // Create small dummy buffers for posters
  const posters = [
    { game_id: 1, poster: Buffer.from('DummyImage1') },
    { game_id: 2, poster: Buffer.from('DummyImage2') },
    { game_id: 3, poster: Buffer.from('DummyImage3') }
  ];

  const stmt = postersDb.prepare("INSERT INTO posters (game_id, poster) VALUES (?, ?)");
  posters.forEach(p => stmt.run(p.game_id, p.poster));
  stmt.finalize();
});

console.log('Databases populated with dummy data including release dates!');
