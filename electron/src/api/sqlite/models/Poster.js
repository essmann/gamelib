const { DataTypes } = require('sequelize');
const sequelize = require('../connection/game_database');

const Poster = sequelize.define('Poster', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  game_id: {
    type: DataTypes.INTEGER
  },
  poster: {
    type: DataTypes.BLOB
  }
}, {
  tableName: 'posters',
  timestamps: false
});

module.exports = Poster;