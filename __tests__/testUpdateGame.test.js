const sqlite3 = require('sqlite3').verbose();
const { updateGame } = require('../backend/api/endpoints/updateGame');

function runAsync(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function queryAsync(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

describe('updateGame endpoint', () => {
    let db;

    beforeEach(async () => {
        db = new sqlite3.Database(':memory:');

        await runAsync(db, `CREATE TABLE games (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          release TEXT,
          description TEXT,
          rating REAL,
          favorite INTEGER,
          date_added TEXT
        )`);

        await runAsync(db, `CREATE TABLE posters (
          id INTEGER PRIMARY KEY,
          game_id INTEGER,
          poster BLOB NOT NULL,
          FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        )`);

        const gameStmt = db.prepare('INSERT INTO games (id, title, release, description, rating, favorite, date_added) VALUES (?, ?, ?, ?, ?, ?, ?)');
        gameStmt.run(1, 'Test Game 1', '2025-01-01', 'Test 1', 5, 0, '2025-01-10');
        gameStmt.run(2, 'Test Game 2', '2025-01-02', 'Test 2', 4, 1, '2025-01-11');
        await new Promise((resolve, reject) => gameStmt.finalize(err => (err ? reject(err) : resolve())));

        const posterStmt = db.prepare('INSERT INTO posters (id, game_id, poster) VALUES (?, ?, ?)');
        posterStmt.run(1, 1, Buffer.from('DummyPoster1'));
        posterStmt.run(2, 2, Buffer.from('DummyPoster2'));
        await new Promise((resolve, reject) => posterStmt.finalize(err => (err ? reject(err) : resolve())));
    });

    afterEach(async () => {
        await new Promise((resolve, reject) => db.close(err => err ? reject(err) : resolve()));
    });

    test('should update a game with id 2', async () => {
        let gamesBefore = await queryAsync(db, `
            SELECT g.id, g.title, g.release, g.description, g.rating, g.favorite, g.date_added, p.poster
            FROM games g
            LEFT JOIN posters p ON g.id = p.game_id
            ORDER BY g.id
        `);
        expect(gamesBefore.length).toBe(2);
        console.log("Old games: " + JSON.stringify(gamesBefore, null, 2));

        const game = {
            id: 2,
            title: 'Updated Test Game 2',
            release: '2025-01-03',
            description: 'Test 2 Updated',
            rating: 3,
            favorite: 0,
            date_added: '2025-01-15',
            poster: Buffer.from('DummyPoster3')
        };

        await updateGame(db, game);

        let gamesAfter = await queryAsync(db, `
            SELECT g.id, g.title, g.release, g.description, g.rating, g.favorite, g.date_added, p.poster
            FROM games g
            LEFT JOIN posters p ON g.id = p.game_id
            ORDER BY g.id
        `);
        console.log("games after: " + JSON.stringify(gamesAfter, null, 2));
        expect(gamesAfter.length).toBe(2);
        expect(gamesAfter[1].id).toBe(2);
        expect(gamesAfter[1].title).toBe('Updated Test Game 2');
        expect(gamesAfter[1].release).toBe('2025-01-03');
        expect(gamesAfter[1].description).toBe('Test 2 Updated');
        expect(gamesAfter[1].rating).toBe(3);
        expect(gamesAfter[1].favorite).toBe(0);
        expect(gamesAfter[1].date_added).toBe('2025-01-15');
        expect(gamesAfter[1].poster.toString()).toBe('DummyPoster3');

        console.log("New games: " + JSON.stringify(gamesAfter, null, 2));
    });
});
