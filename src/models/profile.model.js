import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';

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
    profile_photo: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'profiles',
    timestamps: false
});

export default Profile;