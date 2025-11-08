import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';
import Game from './game.js';

class Poster extends Model {}

Poster.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  game_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Game,
      key: 'id',
    },
  },
  data: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Poster',
  tableName: 'posters',
  timestamps: false,
});

Game.hasOne(Poster, { foreignKey: 'game_id', as: 'posterData' });
Poster.belongsTo(Game, { foreignKey: 'game_id' });

export default Poster;
