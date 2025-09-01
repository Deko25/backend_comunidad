import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Profile from './profile.model.js';
import Post from './post.model.js';

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
    // Necesario para poder incluir correctamente el Post y obtener el autor
    post_id: {
        type: DataTypes.INTEGER,
    // Se permite null para compatibilidad con notificaciones antiguas sin post asociado
    allowNull: true
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

Notification.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

export default Notification;
