import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js'; // your Sequelize instance
import Official_Poster from './official_poster.js';
class Official_Game extends Model {}

Official_Game.init({
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
  modelName: 'Official_Game',
  tableName: 'official_games',
  timestamps: false,
});
Official_Game.hasOne(Official_Poster, { foreignKey: 'game_id' });
Official_Poster.belongsTo(Official_Game, { foreignKey: 'game_id' });
export default Official_Game;
