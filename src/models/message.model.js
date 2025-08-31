import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

const Message = sequelize.define('Message', {
  message_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chat_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  sent_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  read_at: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'messages', timestamps: false });

export default Message;
