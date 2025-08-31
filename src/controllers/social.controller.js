import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.config.js';
import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import Reaction from '../models/reaction.model.js';
import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';

const JWT_SECRET = 'your_jwt_secret';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null){
        return res.sendStatus(401).json({error: 'Unauthorized: No token provided'});
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403).json({error: 'Forbidden: Invalid token'});
        }
        req.user = user;
        next();
    });
};

export const createPost = async (req, res) => {
    const { text_content, privacy } = req.body;
    const user_id = req.user.id;
    try {
        const profile = await Profile.findOne({ where: { user_id }, include: [{ model: User, attributes: ['first_name', 'last_name'] }] });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        const profile_id = profile.profile_id;

        let postData = {
            profile_id,
            text_content,
            privacy,
        };

        const files = req.files || {};
        const file = files.postFile?.[0] || files.image?.[0] || files.file?.[0];
        if (file && file.mimetype.startsWith('image/')) {
            try {
                const result = await cloudinary.uploader.upload(file.path, { folder: 'posts' });
                postData.image_url = result.secure_url;
            } catch (err) {
                console.error('Error subiendo a Cloudinary:', err);
                postData.image_url = file.path; // fallback local
            }
        } else if (file) {
            postData.file_url = file.path;
        }

        const newPost = await Post.create(postData);

        try {
            const Notification = (await import('../models/notification.model.js')).default;
            const userName = profile.User ? `${profile.User.first_name} ${profile.User.last_name}` : 'Alguien';
            const profilePhoto = profile.profile_photo || null;
            const message = `${userName} hizo una nueva publicación`;
            const allProfiles = await Profile.findAll();
            const notifications = await Promise.all(
                allProfiles.map(async (p) => {
                    const notif = await Notification.create({
                        profile_id: p.profile_id,
                        message,
                        type: 'new_post',
                        status: 'unread'
                    });
                    if (req.app && req.app.get('io')) {
                        req.app.get('io').emit('new_notification', {
                            notification_id: notif.notification_id,
                            profile_id: p.profile_id,
                            message,
                            type: 'new_post',
                            profile_photo: profilePhoto,
                            user_name: userName,
                            date: notif.date,
                            status: notif.status
                        });
                    }
                    return notif;
                })
            );
        } catch (notifErr) {
            console.error('Error creando notificación:', notifErr);
        }

        res.status(201).json(newPost);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ error: 'Error creating Post' });
    }
};


export const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: Profile,
                    attributes: ['profile_id', 'profile_photo'],
                    include: [{
                        model: User,
                        attributes: ['first_name', 'last_name', 'email']
                    }]
                },
                // Incluye los comentarios y la información del perfil que los hizo
                {
                    model: Comment,
                    order: [['created_at', 'ASC']],
                    include: [
                        {
                            model: Profile,
                            attributes: ['profile_id', 'profile_photo'],
                            include: [{
                                model: User,
                                attributes: ['first_name', 'last_name']
                            }]
                        }
                    ]
                },
                // Incluye las reacciones y la información del perfil que las hizo
                {
                    model: Reaction,
                    include: [
                        {
                            model: Profile,
                            attributes: ['profile_id', 'profile_photo'],
                            include: [{
                                model: User,
                                attributes: ['first_name', 'last_name']
                            }]
                        }
                    ]
                }
            ],
        });
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Error getting posts' });
    }
};

export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { text_content, image_url, code_url, file_url, privacy } = req.body;
    const user_id = req.user.id;

    try {
        const profile = await Profile.findOne({ where: { user_id } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.profile_id !== profile.profile_id) {
            return res.status(403).json({ error: 'You do not have permission to update this post' });
        }

        await post.update({
            text_content,
            image_url,
            code_url,
            file_url,
            privacy
        });

        res.json({ message: 'Post updated successfully', post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating post' });
    }
};

export const deletePost = async (req, res) => {
    const { postId } = req.params;
    const user_id = req.user.id;

    try {
        const profile = await Profile.findOne({ where: { user_id } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.profile_id !== profile.profile_id) {
            return res.status(403).json({ error: 'You do not have permission to delete this post' });
        }

        await post.destroy();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting post' });
    }
};

export const createComment = async (req, res) => {
    const { post_id } = req.params;
    const user_id = req.user.id;
    const { content } = req.body;
    
    try {
        const profile = await Profile.findOne({ where: { user_id } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        const newComment = await Comment.create({
            post_id,
            profile_id: profile.profile_id,
            content
        });

        // Obtener el comentario recién creado con la información del perfil del autor
        const enrichedComment = await Comment.findByPk(newComment.comment_id, {
            include: [{
                model: Profile,
                attributes: ['profile_id', 'profile_photo'],
                include: [{ model: User, attributes: ['first_name', 'last_name'] }]
            }]
        });

        res.status(201).json(enrichedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating comment' });
    }
};

export const createReaction = async (req, res) => {
    const { post_id } = req.params;
    const user_id = req.user.id;
    const { reaction_type } = req.body;
    
    try {
        const profile = await Profile.findOne({ where: { user_id } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const [reaction, created] = await Reaction.findOrCreate({
            where: {
                post_id,
                profile_id: profile.profile_id,
            },
            defaults: { reaction_type }
        });

        if (!created) {
            // Si la reacción ya existía, la actualizamos
            await reaction.update({ reaction_type });
        }

        // Obtener la reacción (existente o nueva) con la información del perfil
        const enrichedReaction = await Reaction.findByPk(reaction.reaction_id, {
            include: [{
                model: Profile,
                attributes: ['profile_id', 'profile_photo'],
                include: [{ model: User, attributes: ['first_name', 'last_name'] }]
            }]
        });

        res.status(201).json(enrichedReaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating reaction' });
    }
};
