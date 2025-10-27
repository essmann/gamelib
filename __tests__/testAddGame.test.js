const { getGames } = require('../backend/api/endpoints/getGames');
const {addGame} = require('../backend/api/endpoints/addGame');
const sqlite3 = require('sqlite3').verbose();

function runAsync(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

describe('addGame endpoint', () => {
    let db;

    beforeEach(async () => {
        db = new sqlite3.Database(':memory:');

        // Wait for table creation
        await runAsync(db, `CREATE TABLE games (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          release TEXT,
          description TEXT
        )`);

        await runAsync(db, `CREATE TABLE posters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          game_id INTEGER,
          poster BLOB NOT NULL,
          FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        )`);

        // --- Insert dummy game data ---
        const gameStmt = db.prepare('INSERT INTO games (title, release, description) VALUES (?, ?, ?)');
        gameStmt.run('Test Game 1', '2025-01-01', 'Test 1');
        gameStmt.run('Test Game 2', '2025-01-02', 'Test 2');
        await new Promise((resolve, reject) => gameStmt.finalize(err => (err ? reject(err) : resolve())));

        // --- Insert dummy posters ---
        const posterStmt = db.prepare('INSERT INTO posters (game_id, poster) VALUES (?, ?)');
        posterStmt.run(1, Buffer.from('DummyPoster1'));
        posterStmt.run(2, Buffer.from('DummyPoster2'));
        await new Promise((resolve, reject) => posterStmt.finalize(err => (err ? reject(err) : resolve())));
    });

    afterEach(async () => {
        await new Promise((resolve, reject) => db.close(err => err ? reject(err) : resolve()));
    });

    test('should add a game ', async () => {
        const gamesBefore = await getGames(db);
        expect(gamesBefore.length).toBe(2);

        const game = {
            id: 3,
            title: 'Test Game 3',
            release: '2025-01-03',
            description: 'Test 3',
            poster: Buffer.from('DummyPoster3')
        };

        await addGame(db, game);

        const gamesAfter = await getGames(db);
        expect(gamesAfter.length).toBe(3);
        expect(gamesAfter[2].id).toBe(3);
    });
});
