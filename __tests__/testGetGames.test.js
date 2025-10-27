// __tests__/getGames.test.js
const sqlite3 = require('sqlite3').verbose();
const { getGames } = require('../backend/api/endpoints/getGames');

describe('getGames endpoint', () => {
  let db;

  beforeEach(async () => {
    db = new sqlite3.Database(':memory:'); // in-memory DB for testing

    // Wrap setup in a Promise so Jest can await it
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        // Create both tables (since getGames LEFT JOINs posters)
        db.run(`
          CREATE TABLE games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            release TEXT,
            description TEXT
          )
        `);

        db.run(`
          CREATE TABLE posters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            game_id INTEGER,
            poster BLOB NOT NULL,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
          )
        `);

        // Insert sample games
        const gameStmt = db.prepare('INSERT INTO games (title, release, description) VALUES (?, ?, ?)');
        gameStmt.run('Test Game 1', '2025-01-01', 'Test 1');
        gameStmt.run('Test Game 2', '2025-01-02', 'Test 2');
        gameStmt.finalize();

        // Insert dummy posters
        const posterStmt = db.prepare('INSERT INTO posters (game_id, poster) VALUES (?, ?)');
        posterStmt.run(1, Buffer.from('DummyPoster1'));
        posterStmt.run(2, Buffer.from('DummyPoster2'));
        posterStmt.finalize((err) => (err ? reject(err) : resolve()));
      });
    });
  });

  afterEach(async () => {
    // Close the DB cleanly after each test
    await new Promise((resolve, reject) => db.close(err => (err ? reject(err) : resolve())));
  });

  test('should fetch all games with posters', async () => {
    const games = await getGames(db);

    // Verify results
    expect(games).toHaveLength(2);
    expect(games[0]).toHaveProperty('title', 'Test Game 1');
    expect(games[0]).toHaveProperty('poster'); // should include poster data
  });
});
