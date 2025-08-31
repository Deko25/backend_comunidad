import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const UserChat = sequelize.define('UserChat', {
  user_chat_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chat_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'user_chats', timestamps: false });

export default UserChat;
