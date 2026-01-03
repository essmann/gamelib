const { DataTypes } = require('sequelize');
const sequelize = require('../connection/game_database'); // This now works!

const Tag = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
title: {
    type: DataTypes.TEXT,
    allowNull: false
}
}, {
  tableName: 'tags',
  timestamps: false
});

module.exports = Tag;