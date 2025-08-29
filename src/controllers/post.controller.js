import Post from '../models/post.model.js';
import User from '../models/user.model.js';
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
        const post = await Post.create({
            profile_id: req.user.id, // Ajusta si el id de perfil es diferente
            text_content,
            image_url,
            privacy: privacy || 'public',
        });
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{ model: User, attributes: ['first_name', 'last_name'] }],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
