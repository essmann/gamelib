const sequelize = require('./game_database');
const Game = require('../models/Game');
const Poster = require('../models/Poster');
const List = require('../models/List');
const ListItem = require('../models/ListItem');


// Define Associations
Game.hasMany(Poster, { foreignKey: 'game_id', onDelete: 'CASCADE' });
Poster.belongsTo(Game, { foreignKey: 'game_id' });

List.hasMany(ListItem, { foreignKey: 'list_id', onDelete: 'CASCADE' });
ListItem.belongsTo(List, { foreignKey: 'list_id' });

Game.hasMany(ListItem, { foreignKey: 'game_id', onDelete: 'CASCADE' });
ListItem.belongsTo(Game, { foreignKey: 'game_id' });

// Many-to-Many relationship through ListItem
Game.belongsToMany(List, { through: ListItem, foreignKey: 'game_id', otherKey: 'list_id' });
List.belongsToMany(Game, { through: ListItem, foreignKey: 'list_id', otherKey: 'game_id' });

// Initialize database
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Enable foreign keys for SQLite
    await sequelize.query('PRAGMA foreign_keys = ON');
    
    // Sync all models
    await sequelize.sync();
    console.log('All models synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { initDatabase };