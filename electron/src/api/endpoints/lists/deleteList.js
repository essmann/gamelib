export default function deleteList(db, listId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM lists WHERE id = ?`;
    db.run(sql, [listId], function (err) {
      if (err) {
        console.error('Error deleting list:', err);
        return reject(err);
      }
      console.log(`Deleted list ${listId}`);
      resolve({ changes: this.changes });
    });
  });
}

