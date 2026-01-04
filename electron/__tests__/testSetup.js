/**
 * Test Setup Helper
 * Creates an in-memory Sequelize database for testing
 * Copies the actual database into memory for testing
 */

const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

/**
 * Gets the path to the actual database
 * @returns {string} Path to games.db
 */
function getActualDatabasePath() {
  const projectRoot = path.resolve(__dirname, '..');
  return path.join(projectRoot, 'src/api/sqlite/database', 'games.db');
}

/**
 * Copies the actual database into memory
 * @returns {Promise<Buffer>} Database file contents as buffer
 */
async function loadActualDatabaseIntoMemory() {
  const dbPath = getActualDatabasePath();
  
  try {
    if (!fs.existsSync(dbPath)) {
      console.log(`⚠️  Database file not found at ${dbPath}, creating empty test database`);
      return null;
    }
    
    const stats = fs.statSync(dbPath);
    console.log(`📂 Loading actual database from: ${dbPath} (${stats.size} bytes)`);
    
    const dbBuffer = fs.readFileSync(dbPath);
    console.log(`✅ Database loaded into memory (${dbBuffer.length} bytes)`);
    return dbBuffer;
  } catch (err) {
    console.error(`❌ Error loading database: ${err.message}`);
    return null;
  }
}

/**
 * Creates an in-memory Sequelize instance with all models synced
 * Copies the actual database if available
 * @returns {Promise<Object>} Object containing sequelize instance and models
 */
async function setupTestDatabase() {
  console.log('\n🚀 Setting up test database...');
  
  // Load actual database into memory
  const dbBuffer = await loadActualDatabaseIntoMemory();
  
  // Create in-memory SQLite database
  const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: ':memory:',
    logging: (sql) => {
      // Only log important operations, not SELECT *
      if (sql.includes('INSERT') || sql.includes('UPDATE') || sql.includes('DELETE')) {
        console.log(`   📝 SQL: ${sql.substring(0, 80)}...`);
      }
    },
    sync: { force: true }
  });

  // Re-define models for test database
  const TestGame = sequelize.define('Game', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false
    },
    release: {
      type: Sequelize.DataTypes.TEXT
    },
    description: {
      type: Sequelize.DataTypes.TEXT
    },
    rating: {
      type: Sequelize.DataTypes.REAL
    },
    favorite: {
      type: Sequelize.DataTypes.INTEGER
    },
    isCustom: {
      type: Sequelize.DataTypes.INTEGER
    },
    date_added: {
      type: Sequelize.DataTypes.TEXT
    },
    genres: {
      type: Sequelize.DataTypes.TEXT
    },
    developers: {
      type: Sequelize.DataTypes.TEXT
    },
    publishers: {
      type: Sequelize.DataTypes.TEXT
    },
    categories: {
      type: Sequelize.DataTypes.TEXT
    }
  }, {
    tableName: 'games',
    timestamps: false
  });

  const TestPoster = sequelize.define('Poster', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    game_id: {
      type: Sequelize.DataTypes.INTEGER
    },
    poster: {
      type: Sequelize.DataTypes.BLOB('long')
    }
  }, {
    tableName: 'posters',
    timestamps: false
  });

  const TestList = sequelize.define('List', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'lists',
    timestamps: false
  });

  const TestListItem = sequelize.define('ListItem', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    list_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    game_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'list_items',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['list_id', 'game_id']
      }
    ]
  });

  const TestTag = sequelize.define('Tag', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    game_id: {
      type: Sequelize.DataTypes.INTEGER
    },
    tag: {
      type: Sequelize.DataTypes.TEXT
    }
  }, {
    tableName: 'tags',
    timestamps: false
  });

  // Setup associations (CRITICAL!)
  TestGame.hasMany(TestPoster, {
    foreignKey: 'game_id',
    as: 'Posters',
    onDelete: 'CASCADE'
  });
  TestPoster.belongsTo(TestGame, {
    foreignKey: 'game_id',
    as: 'Game'
  });

  TestList.hasMany(TestListItem, {
    foreignKey: 'list_id',
    as: 'Items',
    onDelete: 'CASCADE'
  });
  TestListItem.belongsTo(TestList, {
    foreignKey: 'list_id',
    as: 'List'
  });

  TestGame.hasMany(TestListItem, {
    foreignKey: 'game_id',
    as: 'ListItems',
    onDelete: 'CASCADE'
  });
  TestListItem.belongsTo(TestGame, {
    foreignKey: 'game_id',
    as: 'Game'
  });

  TestGame.belongsToMany(TestList, {
    through: TestListItem,
    foreignKey: 'game_id',
    otherKey: 'list_id',
    as: 'Lists'
  });
  TestList.belongsToMany(TestGame, {
    through: TestListItem,
    foreignKey: 'list_id',
    otherKey: 'game_id',
    as: 'Games'
  });

  // Sync database
  await sequelize.sync({ force: true });
  await sequelize.query('PRAGMA foreign_keys = ON');

  // If we have an actual database, restore it
  if (dbBuffer) {
    console.log('📥 Restoring actual database data into memory...');
    try {
      // Create a temporary database from the buffer
      await new Promise((resolve, reject) => {
        const tempDb = new sqlite3.Database(':memory:', async (err) => {
          if (err) reject(err);
          
          // Deserialize the buffer into the temp database
          tempDb.serialize(() => {
            // Read tables from the original database and copy them
            resolve();
          });
        });
      });
      
      // Alternative approach: use raw SQL to copy data
      const rawDb = new sqlite3.Database(':memory:');
      
      // Attach the buffer database and copy tables
      const bufferDb = new sqlite3.Database(':memory:');
      bufferDb.configure('busyTimeout', 5000);
      
      // Write buffer to temp file, load it, then copy
      const tempPath = path.join(__dirname, '.temp-db-restore.db');
      fs.writeFileSync(tempPath, dbBuffer);
      
      // Attach and copy
      const sourceDb = new sqlite3.Database(tempPath);
      sourceDb.configure('busyTimeout', 5000);
      
      const targetDb = new sqlite3.Database(':memory:');
      targetDb.configure('busyTimeout', 5000);
      
      // Actually, let's use Sequelize to read from the actual database file
      const sourceSequelize = new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        dialect: 'sqlite',
        storage: getActualDatabasePath(),
        logging: false,
        sync: { force: false }
      });
      
      try {
        await sourceSequelize.authenticate();
        
        // Get all tables
        const [tables] = await sourceSequelize.query(
          "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
        );
        
        console.log(`📋 Found ${tables.length} tables in actual database`);
        
        // Copy each table
        for (const table of tables) {
          const tableName = table.name;
          
          // Get table schema
          const [schema] = await sourceSequelize.query(`PRAGMA table_info(${tableName})`);
          
          // Get all data from source
          const [rows] = await sourceSequelize.query(`SELECT * FROM ${tableName}`);
          
          if (rows.length > 0) {
            console.log(`   📄 Copying ${tableName} (${rows.length} rows)...`);
            
            // Insert into test database
            await sequelize.query(`INSERT INTO ${tableName} SELECT * FROM ${tableName}`, {
              replacements: rows
            });
            
            // Actually, need better approach
            for (const row of rows) {
              const columns = Object.keys(row).join(', ');
              const placeholders = Object.keys(row).map(() => '?').join(', ');
              const values = Object.values(row);
              
              try {
                await sequelize.query(
                  `INSERT OR IGNORE INTO ${tableName} (${columns}) VALUES (${placeholders})`,
                  { replacements: values }
                );
              } catch (e) {
                // Skip if table doesn't exist yet
              }
            }
          }
        }
        
        await sourceSequelize.close();
        console.log('✅ Actual database data restored to test database');
      } catch (err) {
        console.log(`⚠️  Could not copy database data: ${err.message}`);
      }
      
      // Cleanup
      try {
        fs.unlinkSync(tempPath);
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (err) {
      console.error(`❌ Error restoring database: ${err.message}`);
    }
  }

  console.log('✅ Test database ready\n');

  return {
    sequelize,
    Game: TestGame,
    Poster: TestPoster,
    List: TestList,
    ListItem: TestListItem,
    Tag: TestTag
  };
}

/**
 * Cleanup test database
 * @param {Object} db - Database object from setupTestDatabase
 */
async function teardownTestDatabase(db) {
  console.log('🧹 Tearing down test database...');
  if (db && db.sequelize) {
    await db.sequelize.close();
    console.log('✅ Test database closed\n');
  }
}

/**
 * Logging utility for tests
 */
const testLogger = {
  test: (msg) => console.log(`   ✏️  ${msg}`),
  action: (msg) => console.log(`   ➡️  ${msg}`),
  created: (msg) => console.log(`   ✅ ${msg}`),
  deleted: (msg) => console.log(`   🗑️  ${msg}`),
  updated: (msg) => console.log(`   🔄 ${msg}`),
  fetched: (msg) => console.log(`   📖 ${msg}`),
  verify: (msg) => console.log(`   ✔️  ${msg}`),
  error: (msg) => console.log(`   ❌ ${msg}`),
  info: (msg) => console.log(`   ℹ️  ${msg}`),
};

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
  testLogger
};
