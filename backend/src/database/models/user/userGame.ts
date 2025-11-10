import { DataTypes, Model } from 'sequelize';
import sequelize from '../../connection.js';
import Game from '../game.js';
import User from './user.js';
class UserGame extends Model{};
UserGame.init({
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        // Defined in primaryKeys array below
    },
    game_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        // Defined in primaryKeys array below
    }
},
{
  sequelize,
  modelName: 'UserGame',
  tableName: 'userGames',
  timestamps: false,
  // Define the composite primary key
});
User.belongsToMany(Game, { 
    through: UserGame, 
    foreignKey: 'user_id', 
    otherKey: 'game_id' 
});
Game.belongsToMany(User, { 
    through: UserGame, 
    foreignKey: 'game_id', 
    otherKey: 'user_id' 
});

export default UserGame;