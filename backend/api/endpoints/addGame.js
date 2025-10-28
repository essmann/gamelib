// api/endpoints/deleteGame.js
async function addGame(db, game) {
    try {
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO games (id, title, release, description) VALUES (?, ?, ?, ?)',
                [game.id, game.title, game.release, game.description],
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                    console.log("Added game with id " + game.id);
                }
            );
        });

        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO posters (game_id, poster) VALUES (?, ?)',
                [game.id, game.poster],
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        });

    } catch (err) {
        console.error('DB error:', err);
        throw err;
    }
}

module.exports.addGame =  addGame;
