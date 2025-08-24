const {DataTypes} = require('sequelize');
const sequelize = require('../config/db.config');
const post = require('./post.model');
const profile = require('./profile.model');

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
Comment.belongsTo(post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});
Comment.belongsTo(profile, {
    foreignKey: 'profile_id',
    onDelete: 'CASCADE'
});

module.exports = Comment;