import { DataTypes, Model } from 'sequelize';
import sequelize from '../../connection.js';
import Official_Game from '../official_game.js';
import CustomGame from '../customGame.js';
import User from './user.js';

class UserGame extends Model {}

UserGame.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    game_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'official_games',
            key: 'id'
        }
    },
    custom_game_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: 'customgames',
            key: 'id'
        }
    },
    isCustom: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    date_added: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: 'UserGame',
    tableName: 'usergames',
    timestamps: false,
});

// Associations remain the same
User.belongsToMany(Official_Game, { 
    through: UserGame, 
    foreignKey: 'user_id', 
    otherKey: 'game_id' 
});
Official_Game.belongsToMany(User, { 
    through: UserGame, 
    foreignKey: 'game_id', 
    otherKey: 'user_id' 
});

User.belongsToMany(CustomGame, {
    through: UserGame,
    foreignKey: 'user_id',
    otherKey: 'custom_game_id'
});
CustomGame.belongsToMany(User, {
    through: UserGame,
    foreignKey: 'custom_game_id',
    otherKey: 'user_id'
});

export default UserGame;