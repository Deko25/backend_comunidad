import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Post from './post.model.js';
import Profile from './profile.model.js';

const Comment = sequelize.define('Comment', {
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'comments',
    timestamps: false
});

export default Comment;