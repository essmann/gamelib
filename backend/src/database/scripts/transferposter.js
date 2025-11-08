import sqlite3 from "sqlite3";
import { open } from "sqlite";
import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

const USERNAME = process.env.DB_USER || 'root';
const PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'gamelib';
const DB_HOST = process.env.DB_HOST || 'localhost';

async function transferPosters() {
  const path = "C:/Users/kenwi/Desktop/gamelib/gamelib/electron/src/api/sqlite/database/external_games.db";

  const sqliteDb = await open({ filename: path, driver: sqlite3.Database });
  const mysqlDb = await mysql.createConnection({ host: DB_HOST, user: USERNAME, password: PASSWORD, database: DB_NAME });

  try {
    const rows = await sqliteDb.all("SELECT * FROM posters");

    let skipped = 0;

    for (const row of rows) {
      try {
        await mysqlDb.execute(
          `INSERT INTO posters 
           (poster_id, poster, game_id) 
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE poster=VALUES(poster), game_id=VALUES(game_id)`,
          [
            row.id ?? null,
            row.image ?? null,   // BLOB data
            row.id ?? null
          ]
        );
      } catch (err) {
        console.warn(`Skipping poster ${row.poster_id}:`, err.sqlMessage);
        skipped++;
      }
    }

    console.log(`Transferred ${rows.length - skipped} poster rows successfully.`);
    if (skipped > 0) console.log(`Skipped ${skipped} rows due to errors.`);
  } catch (err) {
    console.error("Error transferring poster data:", err);
  } finally {
    await sqliteDb.close();
    await mysqlDb.end();
  }
}

transferPosters();
