async function updateGame(db, game) {
    try {
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE games SET title = $title, release = $release, description = $description WHERE id = $id',
                {
                    $id: game.id,
                    $title: game.title,
                    $release: game.release,
                    $description: game.description
                },
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                    console.log("Updated game with id: " + game.id);
                }
            );
        });

        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE posters SET poster = $poster WHERE game_id = $id',
                {
                    $id: game.id,
                    $poster: game.poster
                },
                function (err) {
                    if (err) reject(err);
                    else resolve({ changes: this.changes });
                }
            );
        }); // <-- this was missing

    } catch (err) {
        console.error('Error updating game:', err);
    }
}

module.exports.updateGame = updateGame;

