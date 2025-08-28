import User from './user.model.js';
import Profile from './profile.model.js';
import Role from './role.model.js';
import Post from './post.model.js';
import Comment from './comment.model.js';
import Reaction from './reaction.model.js';

// Relaciones entre User y Profile
User.hasOne(Profile, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
Profile.belongsTo(User, {
    foreignKey: 'user_id'
});

// Relación entre User y Role
User.belongsTo(Role, {
    foreignKey: 'role_id',
    targetKey: 'role_id'
});

// Relaciones entre Profile y Post
Profile.hasMany(Post, {
    foreignKey: 'profile_id',
    onDelete: 'CASCADE'
});
Post.belongsTo(Profile, {
    foreignKey: 'profile_id'
});

