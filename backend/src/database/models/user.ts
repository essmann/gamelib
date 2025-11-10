import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';
import Game from './game.js';

class User extends Model{};

User.init({
    id:{
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
    }
},
 {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
});