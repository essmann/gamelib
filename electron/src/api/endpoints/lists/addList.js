export default function addList(db, name) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO lists (name) VALUES (?)`;

    db.run(sql, [name], function (err) {
      if (err) {
        return reject(err);
      }

      resolve({
        id: this.lastID,
        name
      });
    });
  });
}
