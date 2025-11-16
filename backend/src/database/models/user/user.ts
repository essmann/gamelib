import { DataTypes, Model } from 'sequelize';
import sequelize from '../../connection.js';
import Game from '../official_game.js';
import UserGame from './userGame.js';

class User extends Model{};

User.init({
    user_id:{
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    email: {

        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    games_last_synced: {
        type: DataTypes.DATE, 
        allowNull: true,
    }
   
},
 {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
});


export default User;