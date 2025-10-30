// api/endpoints/deleteGame.js
async function addGame(db, game) {
const poster = game.poster instanceof Uint8Array ? Buffer.from(game.poster) : null;
    console.log("AddGame, inside backend: " + poster);
    console.log(poster);
   
        // Always an integer
game.id = Math.floor(Math.random()+1 *10000);

    
  
 console.log(
  JSON.stringify(
    {
      ...game,
      poster: game.poster
        ? `Uint8Array(${game.poster.length})` // just show length
        : null
    },
    null,
    2
  )
);
    try {
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO games (id, title, release, description, rating, favorite, date_added) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [game.id, game.title, game.release, game.description, game.rating, game.favorite],
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
                [game.id, poster],
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
