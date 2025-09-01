import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Chat = sequelize.define('Chat', {
  chat_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userAId: { type: DataTypes.INTEGER, allowNull: false },
  userBId: { type: DataTypes.INTEGER, allowNull: false },
  creation_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'chats',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['userAId', 'userBId']
    }
  ]
});

export default Chat;
