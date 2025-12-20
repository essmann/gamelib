const { DataTypes } = require('sequelize');
const sequelize = require('../connection/game_database');

const ListItem = sequelize.define('ListItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  list_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  game_id: {
    type: DataTypes.INTEGER,
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

module.exports = ListItem;