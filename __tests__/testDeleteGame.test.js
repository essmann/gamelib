const sqlite3 = require('sqlite3').verbose();
const { deleteGame } = require('../backend/api/endpoints/deleteGame');
const { getGames } = require('../backend/api/endpoints/getGames');

describe('deleteGame endpoint', () => {
  let db;

  beforeEach(async () => {
    db = new sqlite3.Database(':memory:');

    await new Promise((resolve, reject) => {
      db.serialize(() => {
        // --- Create tables ---
        db.run(`CREATE TABLE games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          release TEXT,
          description TEXT
        )`);

        db.run(`CREATE TABLE posters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          game_id INTEGER,
          poster BLOB NOT NULL,
          FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        )`);

        // --- Insert dummy game data ---
        const gameStmt = db.prepare('INSERT INTO games (title, release, description) VALUES (?, ?, ?)');
        gameStmt.run('Test Game 1', '2025-01-01', 'Test 1');
        gameStmt.run('Test Game 2', '2025-01-02', 'Test 2');
        gameStmt.finalize();

        // --- Insert dummy posters ---
        const posterStmt = db.prepare('INSERT INTO posters (game_id, poster) VALUES (?, ?)');
        posterStmt.run(1, Buffer.from('DummyPoster1'));
        posterStmt.run(2, Buffer.from('DummyPoster2'));
        posterStmt.finalize((err) => (err ? reject(err) : resolve()));
      });
    });
  });

  afterEach(async () => {
    await new Promise((resolve, reject) => db.close(err => err ? reject(err) : resolve()));
  });

  test('should delete a game by id', async () => {
    const gamesBefore = await getGames(db);
    expect(gamesBefore.length).toBe(2);

    const result = await deleteGame(db, 1);
    expect(result.changes || 1).toBe(1);

    const gamesAfter = await getGames(db);
    expect(gamesAfter.length).toBe(1);
    expect(gamesAfter[0].id).toBe(2);
  });
});
