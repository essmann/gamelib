export default function addToList(db, listId, gameId) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT OR IGNORE INTO list_items (list_id, game_id)
      VALUES (?, ?)
    `;

    db.run(sql, [listId, gameId], function (err) {
      if (err) {
        return reject(err);
      }

      resolve({
        id: this.lastID || null, // null if it was ignored (duplicate)
        listId,
        gameId
      });
    });
  });
}

