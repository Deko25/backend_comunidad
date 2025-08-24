const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const post = require('./Post');
const profile = require('./Profile');

const reaction = sequelize.define('Reaction', {
    reaction_id: {
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
    reaction_type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'reactions',
    timestamps: false
});

reaction.belongsTo(post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});
reaction.belongsTo(profile, {
    foreignKey: 'profile_id',
    onDelete: 'CASCADE'
});

module.exports = reaction;