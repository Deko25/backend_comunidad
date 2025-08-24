const {DataTypes} = require('sequelize');
const sequelize = require('../config/db.config');

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



module.exports = Profile;