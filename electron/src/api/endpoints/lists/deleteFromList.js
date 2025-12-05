export default function deleteFromList(db, listId, gameId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM list_items WHERE list_id = ? AND game_id = ?`;
    db.run(sql, [listId, gameId], function (err) {
      if (err) {
        console.error('Error removing game from list:', err);
        return reject(err);
      }
      console.log(`Removed game ${gameId} from list ${listId}`);
      resolve({ changes: this.changes });
    });
  });
}
