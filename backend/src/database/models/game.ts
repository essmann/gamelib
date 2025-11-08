import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js'; // your Sequelize instance

class Game extends Model {}

Game.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
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
    type: DataTypes.FLOAT,
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  developers: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  publishers: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categories: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Game',
  tableName: 'games',
  timestamps: false,
});

export default Game;
