import User from './user.model.js';
import Profile from './profile.model.js';
import Role from './role.model.js'; // Import the new Role model

User.hasOne(Profile, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Profile.belongsTo(User, {
    foreignKey: 'user_id'
});

User.belongsTo(Role, {
    foreignKey: 'role_id',
    targetKey: 'role_id'
});