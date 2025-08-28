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
    // text_content y privacy vienen de req.body
    const { text_content, privacy } = req.body;
    
    // Obtener user_id del token de autenticación
    const user_id = req.user.id;
    
    try {
        // Buscar el perfil del usuario usando el user_id
        const profile = await Profile.findOne({ where: { user_id } });
        
        // Si el perfil no se encuentra, no se puede crear el post
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        // Ahora sí, obtenemos el profile_id
        const profile_id = profile.profile_id;
    
        // Lógica para manejar el archivo adjunto
        let postData = {
            profile_id,
            text_content,
            privacy,
        };
    
        if (req.file) {
            const file_type = req.file.mimetype;
            const file_url = req.file.path;
    
            if (file_type.startsWith('image/')) {
                postData.image_url = file_url;
            } else if (file_type.startsWith('text/') || req.file.originalname.endsWith('.js') || req.file.originalname.endsWith('.py') || req.file.originalname.endsWith('.java') || req.file.originalname.endsWith('.cpp') || req.file.originalname.endsWith('.txt')) {
                postData.code_url = file_url;
            } else {
                postData.file_url = file_url;
            }
        }
    
        const newPost = await Post.create(postData);
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
    const user_id = req.user.id; // Get user_id from JWT

    try {
        const profile = await Profile.findOne({ where: { user_id } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Correct security check
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
    const user_id = req.user.id; // Get user_id from JWT

    try {
        const profile = await Profile.findOne({ where: { user_id } });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Correct security check
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
    const user_id = req.user.id; // Correct way to get user_id
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
            profile_id: profile.profile_id, // Use the correct profile_id
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
    const user_id = req.user.id; // Correct way to get user_id
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

        const newReaction = await Reaction.create({
            post_id,
            profile_id: profile.profile_id, // Use the correct profile_id
            reaction_type
        });

        res.status(201).json(newReaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating reaction' });
    }
};