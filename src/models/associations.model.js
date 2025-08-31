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

// **NUEVAS ASOCIACIONES**

// Relaciones entre Post y Comment
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// Relaciones entre Profile y Comment
Profile.hasMany(Comment, {
    foreignKey: 'profile_id',
    onDelete: 'CASCADE'
});
Comment.belongsTo(Profile, {
    foreignKey: 'profile_id'
});

// Relaciones entre Post y Reaction
Post.hasMany(Reaction, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});
Reaction.belongsTo(Post, {
    foreignKey: 'post_id'
});

// Relaciones entre Profile y Reaction
Profile.hasMany(Reaction, {
    foreignKey: 'profile_id',
    onDelete: 'CASCADE'
});
Reaction.belongsTo(Profile, {
    foreignKey: 'profile_id'
});

