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
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'official_games',
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
    },
    date_deleted : {
        type: DataTypes.DATE,
        
    },
    date_updated : {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: 'UserGame',
    tableName: 'official_usergames',
    timestamps: false,
});

// Associations remain the same
User.belongsToMany(Official_Game, { 
    through: UserGame, 
    foreignKey: 'user_id', 
    otherKey: 'game_id' 
});
UserGame.belongsTo(Official_Game, {
    foreignKey: "game_id",
    as: "officialGame",
});



UserGame.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});

export default UserGame;