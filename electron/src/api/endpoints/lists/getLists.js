export default function getLists(db) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        lists.id AS list_id,
        lists.name AS list_name,
        games.id AS game_id,
        games.title AS game_title,
        games.rating,
        games.favorite,
        games.date_added
      FROM lists
      LEFT JOIN list_items ON lists.id = list_items.list_id
      LEFT JOIN games ON list_items.game_id = games.id
      ORDER BY lists.name ASC, games.title ASC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error fetching lists with games:', err);
        return reject(err);
      }

      // Transform rows into structured lists with games array
      const listsMap = {};
      rows.forEach(row => {
        if (!listsMap[row.list_id]) {
          listsMap[row.list_id] = {
            id: row.list_id,
            name: row.list_name,
            games: []
          };
        }

        if (row.game_id) { // some lists might be empty
          listsMap[row.list_id].games.push({
            id: row.game_id,
            title: row.game_title,
            rating: row.rating,
            favorite: row.favorite,
            date_added: row.date_added,
          });
        }
      });

      const lists = Object.values(listsMap);
      resolve(lists);
    });
  });
}
