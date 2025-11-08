import sqlite3 from "sqlite3";
import { open } from "sqlite";
import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

const USERNAME = process.env.DB_USER || 'root';
const PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'gamelib';
const DB_HOST = process.env.DB_HOST || 'localhost';

async function transferData() {
  const path = "C:/Users/kenwi/Desktop/gamelib/gamelib/electron/src/api/sqlite/database/external_games.db";

  const sqliteDb = await open({ filename: path, driver: sqlite3.Database });
  const mysqlDb = await mysql.createConnection({ host: DB_HOST, user: USERNAME, password: PASSWORD, database: DB_NAME });

  try {
    const rows = await sqliteDb.all("SELECT * FROM games");

    for (const row of rows) {
      await mysqlDb.execute(
        `INSERT INTO games 
   (id, title, \`release\`, description, genres, developers, publishers, categories) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id ?? null,
          row.title ?? null,
          row.release ?? null,
          row.short_description ?? null,
          row.genres ?? null,
          row.developers ?? null,
          row.publishers ?? null,
          row.categories ?? null,
        ]
      );

    }

    console.log(`Transferred ${rows.length} rows successfully.`);
  } catch (err) {
    console.error("Error transferring data:", err);
  } finally {
    await sqliteDb.close();
    await mysqlDb.end();
  }
}

transferData();
