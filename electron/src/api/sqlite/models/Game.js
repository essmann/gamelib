const { DataTypes } = require('sequelize');
const sequelize = require('../connection/game_database'); // This now works!

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  release: {
    type: DataTypes.TEXT
  },
  description: {
    type: DataTypes.TEXT
  },
  rating: {
    type: DataTypes.REAL
  },
  favorite: {
    type: DataTypes.INTEGER
  },
  isCustom: {
    type: DataTypes.INTEGER
  },
  date_added: {
    type: DataTypes.TEXT
  },
  genres: {
    type: DataTypes.TEXT
  },
  developers: {
    type: DataTypes.TEXT
  },
  publishers: {
    type: DataTypes.TEXT
  },
  categories: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'games',
  timestamps: false
});

module.exports = Game;