import { DataTypes, Model } from "sequelize";
import sequelize from "../connection.js";
import User from "./user/user.js";
import CustomPoster from "./customPoster.js";

class CustomGame extends Model {
  id: any;
}

CustomGame.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true, // Custom games get their own IDs
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: User, key: "user_id" },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  release: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.REAL,
    allowNull: true,
  },
  favorite: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  date_added: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genres: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  developers: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  publishers: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categories: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: "CustomGame",
  tableName: "customGames",
  timestamps: false,
});

// Link Poster if you want images for custom games
CustomGame.hasOne(CustomPoster, { foreignKey: "game_id" });
CustomPoster.belongsTo(CustomGame, { foreignKey: "game_id" });

User.hasMany(CustomGame, { foreignKey: "user_id" });
CustomGame.belongsTo(User, { foreignKey: "user_id" });

export default CustomGame;
