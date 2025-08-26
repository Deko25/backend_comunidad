import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Post from './post.model.js';
import Profile from './profile.model.js';

const Reaction = sequelize.define('Reaction', {
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

Reaction.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

Reaction.belongsTo(Profile, {
    foreignKey: 'profile_id',
    onDelete: 'CASCADE'
});

export default Reaction;