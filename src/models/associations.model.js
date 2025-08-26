import User from './user.model.js';
import Profile from './profile.model.js';

User.hasOne(Profile, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Profile.belongsTo(User, {
    foreignKey: 'user_id'
});