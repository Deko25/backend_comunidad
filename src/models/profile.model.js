const {DataTypes} = require('sequelize');
const sequelize = require('../db');
const user = require('./User');

const Profile = sequelize.define('Profile', {
    profile_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    experience: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    projects: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'profiles',
    timestamps: false
});

user.hasOne(Profile, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Profile.belongsTo(user, {
    foreignKey: 'user_id'
});

module.exports = Profile;