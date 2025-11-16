import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class CustomPoster extends Model {
  poster_id: any;
}

CustomPoster.init({
  poster_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  poster: {
    type: DataTypes.TEXT('medium'),
    allowNull: true,
  },
  game_id: {          
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'customPoster',
  tableName: 'custom_posters',
  timestamps: false,
});

// Uncomment and update associations if needed
// Official_Game.hasOne(customPoster, { foreignKey: 'game_id' });
// customPoster.belongsTo(Official_Game, { foreignKey: 'game_id' });

export default CustomPoster;
