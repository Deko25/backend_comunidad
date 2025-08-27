import jwt from 'jsonwebtoken';
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
    // text_content y privacy ahora vienen de req.body
    const { text_content, privacy } = req.body;
    const profile_id = req.user.profile_id;
    
    // Obtener la ruta del archivo subido
    let file_url = null;
    let file_type = null;

    if (req.file) {
        file_url = req.file.path; 
        file_type = req.file.mimetype; 
    }

    try {
        const newPost = await Post.create({
            profile_id,
            text_content,
            privacy,
            // Guardamos las rutas de los archivos si existen
            image_url: file_type.startsWith('image/') ? file_url : null,
            code_url: file_type.includes('javascript') || file_type.includes('text') ? file_url : null,
            file_url: file_url
        });
        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
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
                    attributes: ['profile_id', 'bio', 'skills', 'experience', 'projects'],
                    include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }]
                },
                {
                    model: Comment,
                    attributes: ['comment_id', 'post_id', 'profile_id', 'content', 'created_at'],
                    include: [{ model: Profile, attributes: ['profile_id', 'bio'] }]
                },
                {
                    model: Reaction,
                    attributes: ['reaction_id', 'post_id', 'profile_id', 'reaction_type', 'created_at'],
                    include: [{ model: Profile, attributes: ['profile_id', 'bio'] }]
                }
            ],
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error getting posts' });
    }
};

export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { text_content, image_url, code_url, file_url, privacy } = req.body;

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.profile_id !== req.user.profile_id) {
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

    try {
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.profile_id !== req.user.profile_id) {
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
    const profile_id = req.user.profile_id;
    const { content } = req.body;
    try {
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const newComment = await Comment.create({
            post_id,
            profile_id,
            content
        });

        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating comment' });
    }
};

export const createReaction = async (req, res) => {
    const { post_id } = req.params;
    const profile_id = req.user.profile_id;
    const { reaction_type } = req.body;
    try {
        const post = await Post.findByPk(post_id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const newReaction = await Reaction.create({
            post_id,
            profile_id,
            reaction_type
        });

        res.status(201).json(newReaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating reaction' });
    }
};