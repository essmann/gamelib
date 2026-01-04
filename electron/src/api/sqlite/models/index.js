const sequelize = require('../connection/game_database');

const Game = require('./Game');
const Poster = require('./Poster');
const List = require('./List');
const ListItem = require('./ListItem');
const Tag = require("./Tag");

/* =========================
   Associations (WITH ALIASES)
   ========================= */

// Game ↔ Poster
Game.hasMany(Poster, {
  foreignKey: 'game_id',
  as: 'Posters',
  onDelete: 'CASCADE'
});
Poster.belongsTo(Game, {
  foreignKey: 'game_id',
  as: 'Game'
});

// Game ↔ Tag

// List ↔ ListItem
List.hasMany(ListItem, {
  foreignKey: 'list_id',
  as: 'Items',
  onDelete: 'CASCADE'
});
ListItem.belongsTo(List, {
  foreignKey: 'list_id',
  as: 'List'
});

// Game ↔ ListItem
Game.hasMany(ListItem, {
  foreignKey: 'game_id',
  as: 'ListItems',
  onDelete: 'CASCADE'
});
ListItem.belongsTo(Game, {
  foreignKey: 'game_id',
  as: 'Game'
});

// Game ↔ List (Many-to-Many)
Game.belongsToMany(List, {
  through: ListItem,
  foreignKey: 'game_id',
  otherKey: 'list_id',
  as: 'Lists'
});
List.belongsToMany(Game, {
  through: ListItem,
  foreignKey: 'list_id',
  otherKey: 'game_id',
  as: 'Games'
});

/* =========================
   Init
   ========================= */

async function initDatabase() {
  try {
    console.log('[INIT] Authenticating database connection...');
    await sequelize.authenticate();
    console.log('[INIT] Database connection established successfully.');

    console.log('[INIT] Setting PRAGMA foreign_keys = ON...');
    await sequelize.query('PRAGMA foreign_keys = ON');
    
    console.log('[INIT] Starting model synchronization...');
    console.log('[INIT] Models to sync:', [
      'Game',
      'Poster', 
      'List',
      'ListItem',
      'Tag'
    ]);
    
    // Sync all models
    await sequelize.sync({ alter: false });

    console.log('[INIT] All models synchronized successfully.');
    console.log('[INIT] Checking model definitions...');
    
    // Verify models are defined
    const models = sequelize.models;
    console.log('[INIT] Models registered:', Object.keys(models));
    
    if (models.Game) {
      console.log('[INIT] Game model found - table name:', models.Game.tableName);
      console.log('[INIT] Game attributes:', Object.keys(models.Game.rawAttributes));
    } else {
      console.warn('[INIT] Game model NOT found!');
    }
    
    console.log('[INIT] Game associations:', Object.keys(Game.associations));
  } catch (error) {
    console.error('[INIT] Database initialization error:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  Game,
  Poster,
  List,
  ListItem,
  Tag,
  initDatabase
};
