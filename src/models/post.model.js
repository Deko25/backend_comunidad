const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const profile = require('./Profile');

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