import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Profile from './profile.model.js';

const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: 'unread'
    }
}, {
    tableName: 'notifications',
    timestamps: false
});

Notification.belongsTo(Profile, {
    foreignKey: 'profile_id',
    onDelete: 'CASCADE'
});

export default Notification;
