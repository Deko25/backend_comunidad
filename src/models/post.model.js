const {DataTypes} = require('sequelize');
const sequelize = require('../config/db.config');
const profile = require('./profile.model');

const Post = sequelize.define('Post', {
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text_content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    code_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    file_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    privacy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'public'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'posts',
    timestamps: false
});

Post.belongsTo(profile, {
    foreignKey: 'profile_id',
    onDelete: 'CASCADE'
});

module.exports = Post;