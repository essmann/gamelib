const { DataTypes } = require('sequelize');
const sequelize = require('../connection/game_database');

const List = sequelize.define('List', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'lists',
  timestamps: false
});

module.exports = List;