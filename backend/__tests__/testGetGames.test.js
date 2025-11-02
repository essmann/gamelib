const sqlite3 = require('sqlite3').verbose();
const { getGames } = require('.../api/endpoints/getGames');

describe('getGames endpoint', () => {
  let db;

beforeEach(async () => {
  db = new sqlite3.Database(':memory:');

  await new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE games (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          release TEXT,
          description TEXT,
          rating INTEGER,
          favorite INTEGER,
          date_added TEXT
        )
      `);

      db.run(`
        CREATE TABLE posters (
          id INTEGER PRIMARY KEY,
          game_id INTEGER,
          poster BLOB NOT NULL,
          FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        )
      `);

      const gameStmt = db.prepare('INSERT INTO games (id, title, release, description, rating, favorite, date_added) VALUES (?, ?, ?, ?, ?, ?, ?)');
      gameStmt.run(1, 'Test Game 1', '2025-01-01', 'Test 1', 5, 0, '2025-01-10');
      gameStmt.run(2, 'Test Game 2', '2025-01-02', 'Test 2', 4, 1, '2025-01-11');
      gameStmt.finalize();

      const posterStmt = db.prepare('INSERT INTO posters (id, game_id, poster) VALUES (?, ?, ?)');
      posterStmt.run(1, 1, Buffer.from('DummyPoster1'));
      posterStmt.run(2, 2, Buffer.from('DummyPoster2'));
      posterStmt.finalize((err) => (err ? reject(err) : resolve()));
    });
  });
});

  afterEach(async () => {
    await new Promise((resolve, reject) => db.close(err => (err ? reject(err) : resolve())));
  });

  test('should fetch all games with posters', async () => {
    const games = await getGames(db);

    expect(games).toHaveLength(2);
    expect(games[0]).toMatchObject({
      id: 1,
      title: 'Test Game 1',
      release: '2025-01-01',
      description: 'Test 1'
    });
    expect(games[0].poster.toString()).toBe('DummyPoster1');

    expect(games[1]).toMatchObject({
      id: 2,
      title: 'Test Game 2',
      release: '2025-01-02',
      description: 'Test 2'
    });
    expect(games[1].poster.toString()).toBe('DummyPoster2');
  });
});
