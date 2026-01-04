#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourceDir = path.join(__dirname, 'src/api/sqlite/database');
const destDir = path.join(__dirname, 'dist/win-unpacked/resources/app.asar.unpacked');

// Database files to copy
const dbFiles = ['games.db', 'external_games.db'];

console.log('🔄 Copying database files...');
console.log(`📁 Source: ${sourceDir}`);
console.log(`📁 Destination: ${destDir}`);

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`✅ Created destination directory: ${destDir}`);
}

// Copy each database file
dbFiles.forEach((file) => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);

  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      const stats = fs.statSync(destPath);
      console.log(`✅ Copied ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    } catch (err) {
      console.error(`❌ Error copying ${file}:`, err.message);
      process.exit(1);
    }
  } else {
    console.warn(`⚠️  Database file not found: ${sourcePath}`);
  }
});

console.log('✅ All database files copied successfully!');
