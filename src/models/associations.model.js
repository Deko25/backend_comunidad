const User = require('./user.model');
const Profile = require('./profile.model');
const Post = require('./post.model');

User.hasOne(Profile, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Profile.belongsTo(User, {
    foreignKey: 'user_id'
});