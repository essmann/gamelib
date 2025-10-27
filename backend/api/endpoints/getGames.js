async function getGames(db) {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM games LEFT JOIN posters ON games.id = posters.game_id ', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    console.log(`Fetched ${rows.length} rows from the games database. Rows: ${JSON.stringify(rows)}`);
    return rows;

  } catch (err) {
    console.error('DB error:', err);
    throw err;
  }
}

module.exports.getGames = getGames;
