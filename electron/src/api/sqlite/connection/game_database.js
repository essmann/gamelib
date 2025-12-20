// database.js
const { Sequelize } = require('sequelize');
const path = require('path');
const { app } = require('electron');

function getDatabasePath() {
  const dbFileName = 'games.db';
  const isDev = !app.isPackaged;
  
  if (isDev) {
    console.log("Dev Mode");
    console.log("Dirname: " + __dirname);
    const projectRoot = path.resolve(__dirname, '../../../../../');
    console.log("Project Root: " + projectRoot);
    return path.join(projectRoot, 'src/api/sqlite/database', dbFileName);
  } else {
    return path.join(process.resourcesPath, 'app.asar.unpacked', 'games.db');
  }
}

const dbPath = getDatabasePath();
console.log('Using SQLite DB at:', dbPath);

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Set to console.log to see SQL queries
});

module.exports = sequelize;