import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';
import Official_Game from './official_game.js';

class Official_Poster extends Model {}

Official_Poster.init({
  poster_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
  },
  poster: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  },
  game_id: {          
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Official_Poster',
  tableName: 'official_posters',
  timestamps: false,
});

// Uncomment and update associations if needed
// Official_Game.hasOne(Official_Poster, { foreignKey: 'game_id' });
// Official_Poster.belongsTo(Official_Game, { foreignKey: 'game_id' });

export default Official_Poster;
