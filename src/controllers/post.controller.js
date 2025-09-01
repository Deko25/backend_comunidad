import Post from '../models/post.model.js';
import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';
import { notifyNewPost } from '../services/notification.helper.js';
import cloudinary from '../config/cloudinary.config.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/posts/' });

export const createPost = async (req, res) => {
    try {
        const { text_content, privacy } = req.body;
        let image_url = null;
        // Buscar el archivo en cualquiera de los campos
        const files = req.files || {};
        const file = files.postFile?.[0] || files.image?.[0] || files.file?.[0];
        console.log('Body recibido:', req.body);
        console.log('Archivos recibidos:', files);
        if (file) {
            try {
                console.log('Subiendo archivo a Cloudinary:', file.path);
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'posts',
                });
                image_url = result.secure_url;
                console.log('URL de Cloudinary:', image_url);
            } catch (err) {
                console.error('Error subiendo a Cloudinary:', err);
            }
        } else {
            console.warn('No se recibió archivo para subir a Cloudinary.');
        }
        // Determinar profile_id real (token debería traer profile_id, si no, buscar por user_id)
        let profileId = req.user.profile_id;
        if (!profileId && req.user.id) {
            const found = await Profile.findOne({ where: { user_id: req.user.id } });
            profileId = found?.profile_id;
        }
        if (!profileId) {
            return res.status(400).json({ message: 'No se pudo determinar el profile_id del usuario' });
        }

    const post = await Post.create({
            profile_id: profileId,
            text_content,
            image_url,
            privacy: privacy || 'public',
        });
    // TODO: Obtener destinatarios reales (amigos/seguidores). Por ahora no enviaremos a nadie.
    // Ejemplo: const followerIds = await getFollowers(profileId);
    await notifyNewPost({ postId: post.post_id, authorProfileId: profileId, recipientProfileIds: [] });
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: Profile,
                attributes: ['profile_id','profile_photo','user_id'],
                include: [{ model: User, attributes: ['first_name','last_name'] }]
            }]
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
