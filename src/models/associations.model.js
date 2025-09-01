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

// Asociaciones para Chat, UserChat y Message
import Chat from './chat.model.js';
import UserChat from './user_chat.model.js';
import Message from './message.model.js';

// Un chat tiene muchos mensajes
Chat.hasMany(Message, { foreignKey: 'chat_id', onDelete: 'CASCADE' });
Message.belongsTo(Chat, { foreignKey: 'chat_id' });

// Un usuario tiene muchos mensajes
User.hasMany(Message, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'user_id' });

// Un chat tiene muchos participantes (UserChat)
Chat.hasMany(UserChat, { foreignKey: 'chat_id', onDelete: 'CASCADE' });
UserChat.belongsTo(Chat, { foreignKey: 'chat_id' });

// Un usuario puede estar en muchos chats (UserChat)
User.hasMany(UserChat, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserChat.belongsTo(User, { foreignKey: 'user_id' });

