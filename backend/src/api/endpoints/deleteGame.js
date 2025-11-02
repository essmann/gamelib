// api/endpoints/deleteGame.js
async function deleteGame(db, id) {
  console.log("Trying to delete game with id: " + id);
  try {
    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM games WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    console.log(`Deleted game with id ${id}.`);
    return result;
  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
}

module.exports = { deleteGame };
