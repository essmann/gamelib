import sqlite3 from "sqlite3";
import { open } from "sqlite";
import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

const USERNAME = process.env.DB_USER || 'root';
const PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'gamelib';
const DB_HOST = process.env.DB_HOST || 'localhost';

async function transferPosters() {
  const path = "C:/Users/kenwi/Desktop/gamelib/gamelib/electron/src/api/sqlite/database/external_games.db";
  const sqliteDb = await open({ filename: path, driver: sqlite3.Database });
  const mysqlDb = await mysql.createConnection({ 
    host: DB_HOST, 
    user: USERNAME, 
    password: PASSWORD, 
    database: DB_NAME 
  });

  try {
    const rows = await sqliteDb.all("SELECT * FROM posters");
    console.log(`Found ${rows.length} poster rows to transfer`);
    
    let successCount = 0;
    let skipped = 0;
    
    for (const row of rows) {
      try {
        await mysqlDb.execute(
          `INSERT INTO official_posters 
           (poster_id, poster, game_id) 
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           poster = VALUES(poster), 
           game_id = VALUES(game_id)`,
          [
            row.id ?? null,
            row.image ?? null,   // BLOB data
            row.id ?? null       // game_id should match the game's id
          ]
        );
        successCount++;
        
        if (successCount % 100 === 0) {
          console.log(`Progress: ${successCount}/${rows.length}`);
        }
      } catch (err) {
        console.warn(`Skipping poster ${row.id}:`, err.sqlMessage || err.message);
        skipped++;
      }
    }
    
    console.log(`✅ Poster transfer complete!`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${rows.length}`);
    
  } catch (err) {
    console.error("Error transferring poster data:", err);
  } finally {
    await sqliteDb.close();
    await mysqlDb.end();
  }
}

transferPosters();