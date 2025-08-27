import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.config.js';

class Role extends Model {}

Role.init({
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    role_name: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: false
});

export default Role;