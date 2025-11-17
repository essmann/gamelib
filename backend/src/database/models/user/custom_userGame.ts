import { DataTypes, Model } from 'sequelize';
import sequelize from '../../connection.js';
import Official_Game from '../official_game.js';
import CustomGame from '../customGame.js';
import User from './user.js';

class CustomUserGame extends Model {}

CustomUserGame.init({
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
        allowNull: false,
        references: {
            model: 'custom_games',
            key: 'id'
        }
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
    modelName: 'CustomUserGame',
    tableName: 'custom_usergames',
    timestamps: false,
});


// =========================
// Correct Associations
// =========================

// Users → Custom Games (many to many)
User.belongsToMany(CustomGame, { 
    through: CustomUserGame,
    foreignKey: 'user_id',
    otherKey: 'game_id'
});

// Each custom_usergame row belongs to a CustomGame
CustomUserGame.belongsTo(CustomGame, {
    foreignKey: "game_id",
    as: "game"
});

// Each custom_usergame row belongs to a User
CustomUserGame.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});


export default CustomUserGame;
