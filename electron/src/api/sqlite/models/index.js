const sequelize = require('../connection/game_database');

const Game = require('./Game');
const Poster = require('./Poster');
const List = require('./List');
const ListItem = require('./ListItem');
const Tag = require("./Tag")
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
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    await sequelize.query('PRAGMA foreign_keys = ON');
    await sequelize.sync();

    console.log('All models synchronized successfully.');
    console.log('Game associations:', Object.keys(Game.associations));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  Game,
  Poster,
  List,
  ListItem,
  initDatabase
};
