import sqlite3 from "sqlite3";
import { open } from "sqlite";
import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

const USERNAME = process.env.DB_USER || 'root';
const PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'gamelib';
const DB_HOST = process.env.DB_HOST || 'localhost';

async function transferData() {
  const path = "C:/Users/kenwi/Desktop/gamelib/gamelib/electron/src/api/sqlite/database/external_games.db";
  const sqliteDb = await open({ filename: path, driver: sqlite3.Database });
  const mysqlDb = await mysql.createConnection({ 
    host: DB_HOST, 
    user: USERNAME, 
    password: PASSWORD, 
    database: DB_NAME 
  });

  try {
    const rows = await sqliteDb.all("SELECT * FROM games");
    console.log(`Found ${rows.length} rows to transfer`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const row of rows) {
      try {
        await mysqlDb.execute(
          `INSERT INTO official_games 
           (id, title, \`release\`, description, genres, developers, publishers, categories) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           \`release\` = VALUES(\`release\`),
           description = VALUES(description),
           genres = VALUES(genres),
           developers = VALUES(developers),
           publishers = VALUES(publishers),
           categories = VALUES(categories)`,
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
        successCount++;
        if (successCount % 100 === 0) {
          console.log(`Progress: ${successCount}/${rows.length}`);
        }
      } catch (err) {
        errorCount++;
        console.error(`Error inserting row ${row.id}:`, err.message);
      }
    }
    
    console.log(`✅ Transfer complete!`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${rows.length}`);
    
  } catch (err) {
    console.error("Error transferring data:", err);
  } finally {
    await sqliteDb.close();
    await mysqlDb.end();
  }
}

transferData();