// src/controllers/notification.controller.js

const Post = require('../models/post.model');
const User = require('../models/user.model');

const getPostNotifications = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['first_name', 'last_name', 'profile_image']
      }],
      order: [['created_at', 'DESC']]
    });

    const notifications = posts.map(post => ({
      type: 'post',
      user: `${post.User.first_name} ${post.User.last_name}`,
      profile_image: post.User.profile_image || '/assets/img/default.webp',
      content: post.content,
      created_at: post.created_at
    }));

    res.json(notifications);
  } catch (error) {
    console.error('Error en getPostNotifications:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones de posts' });
  }
};

module.exports = { getPostNotifications };
