import { DataTypes, Model } from 'sequelize';
import sequelize from '../../connection.js';
import User from './user.js';

class Session extends Model {}

Session.init(
  {
    session_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: false,
  }
);

// Associations
Session.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Session, { foreignKey: 'user_id' });

export default Session;
