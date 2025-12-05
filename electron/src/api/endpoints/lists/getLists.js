
export default function getLists(db) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, name FROM lists ORDER BY name ASC`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error fetching lists:', err);
        return reject(err);
      }
      console.log('Fetched lists:', rows);
      resolve(rows);
    });
  });
}


