import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js'; // your Sequelize instance

class Game extends Model {}

Game.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  release: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.REAL,
    allowNull: true,
  },
  favorite: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date_added: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genres: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  developers: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  publishers: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categories: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Game',
  tableName: 'games',
  timestamps: false,
});

export default Game;
