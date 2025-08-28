import { DataTypes } from 'sequelize';
import db from '../config/db.config.js';

const Notification = db.define('notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  profile_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // 'like', 'comment', 'message', 'friend_post'
    allowNull: false,
  },
  reference_id: {
    type: DataTypes.UUID, // ID de la publicación, mensaje, etc.
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

export default Notification;
