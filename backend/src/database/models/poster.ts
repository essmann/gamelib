import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';
import Game from './game.js';

class Poster extends Model {}

Poster.init({
  poster_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    
  },
  poster: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  game_id: {          // <-- add this
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Poster',
  tableName: 'posters',
  timestamps: false,
});


Game.hasOne(Poster, { foreignKey: 'game_id' });
Poster.belongsTo(Game, { foreignKey: 'game_id' });

export default Poster;
