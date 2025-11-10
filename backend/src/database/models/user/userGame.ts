import { DataTypes, Model } from 'sequelize';
import sequelize from '../../connection.js';
import Game from '../game.js';

class UserGame extends Model{};

UserGame.init({
    user_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    },
    // game: {Game}
},
 {
  sequelize,
  modelName: 'UserGame',
  tableName: 'userGames',
  timestamps: false,
});